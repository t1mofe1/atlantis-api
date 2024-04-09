export type GizmoSmsVerificationConfirmDto = {
  /**
   * Verification token
   *
   * @minLength 16
   * @maxLength 64
   */
  token: string;

  /**
   * Confirmation code
   *
   * @minLength 4
   * @maxLength 12
   */
  confirmationCode: string;
};
