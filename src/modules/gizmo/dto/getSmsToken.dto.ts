export type SmsTokenDto = {
  /**
   * Business name
   */
  From?: string;

  /**
   * Phone number
   *
   * @phone_number
   */
  To: string;

  /**
   * SMS text body
   */
  Body: string;
};
