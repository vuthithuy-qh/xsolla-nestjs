import * as crypto from 'crypto';

export class SignatureUtil {
  /**
   * Verify Xsolla webhook signature
   * @param signature - Signature from Authorization header
   * @param requestBody - Raw request body as string
   * @param projectKey - Xsolla PROJECT KEY (not webhook secret!)
   */
  static verifySignature(
    signature: string,
    requestBody: string,
    projectKey: string,
  ): boolean {
    // Remove "Signature " prefix if exists
    const cleanSignature = signature.replace('Signature ', '');

    // Công thức: sha1(json_body + project_key)
    const expectedSignature = crypto
      .createHash('sha1')
      .update(requestBody + projectKey) // ← Concat trực tiếp
      .digest('hex');

    console.log('🔍 Signature Debug:');
    console.log('  Received signature:', cleanSignature);
    console.log('  Expected signature:', expectedSignature);
    console.log('  Raw body length:', requestBody.length);
    console.log('  Project key:', projectKey.substring(0, 10) + '...');
    console.log('  Match:', cleanSignature === expectedSignature);

    return cleanSignature === expectedSignature;
  }
}
