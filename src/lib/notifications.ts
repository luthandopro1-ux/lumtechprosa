// Pure utility module: structures in-app + email payloads for transactional events.
// No side effects, no network calls — callers decide how to dispatch.

export type NotificationChannel = "in_app" | "email";

export type NotificationEvent =
  | "milestone.created"
  | "milestone.progress_updated"
  | "milestone.completed"
  | "milestone.blocked"
  | "document.uploaded"
  | "document.signed"
  | "contract.signed_by_all"
  | "voucher.issued"
  | "voucher.redeemed"
  | "escrow.deposit"
  | "escrow.release";

export interface BaseContext {
  projectId?: string;
  projectTitle?: string;
  recipientName?: string;
  actorName?: string;
}

export interface MilestoneContext extends BaseContext {
  milestoneTitle: string;
  progressPct?: number;
  status?: string;
}

export interface DocumentContext extends BaseContext {
  documentTitle: string;
  docType: string;
}

export interface VoucherContext extends BaseContext {
  voucherCode: string;
  valueCents: number;
  expiresAt?: string;
}

export interface EscrowContext extends BaseContext {
  amountCents: number;
  memo?: string;
}

export type EventContext =
  | { event: "milestone.created" | "milestone.progress_updated" | "milestone.completed" | "milestone.blocked"; data: MilestoneContext }
  | { event: "document.uploaded" | "document.signed" | "contract.signed_by_all"; data: DocumentContext }
  | { event: "voucher.issued" | "voucher.redeemed"; data: VoucherContext }
  | { event: "escrow.deposit" | "escrow.release"; data: EscrowContext };

export interface BuiltNotification {
  event: NotificationEvent;
  channel: NotificationChannel;
  templateName: string; // matches src/lib/email-templates/<name>.tsx if email
  subject: string;
  preview: string; // short in-app summary
  body: string; // longer plain-text body
  templateData: Record<string, unknown>;
}

const zar = (cents: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(cents / 100);

function projectTag(ctx: BaseContext): string {
  return ctx.projectTitle ? ` · ${ctx.projectTitle}` : "";
}

export function buildNotification(input: EventContext, channel: NotificationChannel = "in_app"): BuiltNotification {
  switch (input.event) {
    case "milestone.created": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "milestone-created",
        subject: `New milestone added${projectTag(d)}`,
        preview: `${d.milestoneTitle} was added to the schedule.`,
        body: `A new milestone "${d.milestoneTitle}" has been added${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "milestone.progress_updated": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "milestone-progress",
        subject: `Progress update: ${d.milestoneTitle}`,
        preview: `${d.milestoneTitle} is now ${d.progressPct ?? 0}% complete.`,
        body: `${d.actorName ?? "The team"} updated "${d.milestoneTitle}" to ${d.progressPct ?? 0}%${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "milestone.completed": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "milestone-completed",
        subject: `Milestone completed: ${d.milestoneTitle}`,
        preview: `${d.milestoneTitle} marked complete.`,
        body: `Milestone "${d.milestoneTitle}" has been marked complete${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "milestone.blocked": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "milestone-blocked",
        subject: `Milestone blocked: ${d.milestoneTitle}`,
        preview: `${d.milestoneTitle} needs attention.`,
        body: `Milestone "${d.milestoneTitle}" is blocked${projectTag(d)} and requires attention.`,
        templateData: { ...d },
      };
    }
    case "document.uploaded": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "document-uploaded",
        subject: `New ${d.docType}: ${d.documentTitle}`,
        preview: `${d.actorName ?? "Someone"} uploaded ${d.documentTitle}.`,
        body: `${d.actorName ?? "A project party"} uploaded "${d.documentTitle}" (${d.docType})${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "document.signed": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "document-signed",
        subject: `Signed: ${d.documentTitle}`,
        preview: `${d.documentTitle} was signed.`,
        body: `${d.actorName ?? "A party"} signed "${d.documentTitle}"${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "contract.signed_by_all": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "contract-fully-signed",
        subject: `Contract fully signed: ${d.documentTitle}`,
        preview: `All parties have signed.`,
        body: `Contract "${d.documentTitle}" is now signed by all parties${projectTag(d)}.`,
        templateData: { ...d },
      };
    }
    case "voucher.issued": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "voucher-issued",
        subject: `Voucher issued: ${zar(d.valueCents)}`,
        preview: `Voucher ${d.voucherCode} is ready to redeem.`,
        body: `A voucher worth ${zar(d.valueCents)} (${d.voucherCode}) has been issued${projectTag(d)}${d.expiresAt ? `. Expires ${d.expiresAt}.` : "."}`,
        templateData: { ...d, valueZar: zar(d.valueCents) },
      };
    }
    case "voucher.redeemed": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "voucher-redeemed",
        subject: `Voucher redeemed: ${zar(d.valueCents)}`,
        preview: `Voucher ${d.voucherCode} was redeemed.`,
        body: `Voucher ${d.voucherCode} worth ${zar(d.valueCents)} was redeemed${projectTag(d)}.`,
        templateData: { ...d, valueZar: zar(d.valueCents) },
      };
    }
    case "escrow.deposit": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "escrow-deposit",
        subject: `Escrow funded: ${zar(d.amountCents)}`,
        preview: `${zar(d.amountCents)} deposited into escrow.`,
        body: `${zar(d.amountCents)} has been deposited into escrow${projectTag(d)}${d.memo ? ` — ${d.memo}` : ""}.`,
        templateData: { ...d, amountZar: zar(d.amountCents) },
      };
    }
    case "escrow.release": {
      const d = input.data;
      return {
        event: input.event,
        channel,
        templateName: "escrow-release",
        subject: `Escrow released: ${zar(d.amountCents)}`,
        preview: `${zar(d.amountCents)} released from escrow.`,
        body: `${zar(d.amountCents)} has been released from escrow${projectTag(d)}${d.memo ? ` — ${d.memo}` : ""}.`,
        templateData: { ...d, amountZar: zar(d.amountCents) },
      };
    }
  }
}

// Convenience: build the same event for both channels at once
export function buildAllChannels(input: EventContext): BuiltNotification[] {
  return [buildNotification(input, "in_app"), buildNotification(input, "email")];
}
