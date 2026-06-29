export type PolicyIssueCode =
  | 'UNVERIFIED_UPTIME'
  | 'UNVERIFIED_MARGIN'
  | 'UNVERIFIED_PRICE'
  | 'UNVERIFIED_TRIAL'
  | 'UNVERIFIED_INSTANT_ACTIVATION'
  | 'UNVERIFIED_REVIEW'
  | 'UNIVERSAL_COMPATIBILITY'
  | 'ALL_CHANNELS_CLAIM'
  | 'ALL_MATCHES_CLAIM'
  | 'PAYMENT_EVASION_LANGUAGE'
  | 'ISP_BYPASS_INSTRUCTION'
  | 'SIDELOADING_INSTRUCTION'
  | 'STREAM_ACQUISITION_INSTRUCTION'
  | 'CREDENTIAL_DELIVERY_AUTOMATION'
  | 'THIRD_PARTY_TRADEMARK_REVIEW'
  | 'ENGLISH_VISIBLE_COPY'
  | 'LEGAL_COPY_UNAPPROVED'
  | 'COMPETITOR_FACT_UNVERIFIED'
  | 'RIGHTS_AVAILABILITY_UNVERIFIED';

export interface PublicationIssue {
  readonly code: PolicyIssueCode;
  readonly severity: 'warning' | 'error';
  readonly excerpt: string;
}

export interface PublicationStatus {
  readonly path: string;
  readonly status: 'approved' | 'review_required' | 'blocked';
  readonly noindex: boolean;
  readonly issues: readonly PublicationIssue[];
}
