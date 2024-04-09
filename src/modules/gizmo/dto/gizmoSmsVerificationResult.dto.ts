export type GizmoSmsVerificationResultDto = {
  /**
   * Result code
   */
  result: number;

  /**
   * Verification token
   */
  token: string;

  /**
   * Code length
   */
  codeLength: number;

  /**
   * Mobile phone number in international format
   *
   * @phone_number
   */
  mobilePhone: string;

  /**
   * Delivery method
   */
  deliveryMethod: number;
};
