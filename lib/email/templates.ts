const verificationEmailTemplate = (
  verificationUrl: string,
  name: string,
  officeTitle: string
) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Petits Bureaux</h1>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${name},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Merci pour votre intérêt pour le bureau <strong>${officeTitle}</strong>.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Pour confirmer votre demande et nous permettre de vous contacter, 
              veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmer mon email
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
            </p>
            
            <p style="color: #007bff; word-break: break-all; margin-bottom: 20px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Ce lien expirera dans 24 heures pour des raisons de sécurité.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Cordialement,<br>
              L'équipe Petits Bureaux
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 14px;">
              Si vous n'avez pas demandé cette confirmation, vous pouvez ignorer cet email.
            </p>
          </div>
        </div>
      `;
};

const leadConfirmationEmailTemplate = (name: string, officeTitle: string) => {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Petits Bureaux</h1>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Merci ${name} !</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Votre demande pour le bureau <strong>${officeTitle}</strong> a été confirmée avec succès.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Notre équipe va maintenant examiner votre demande et vous contacter dans les plus brefs délais 
              pour discuter des détails et organiser une visite si nécessaire.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              En attendant, n'hésitez pas à consulter nos autres bureaux disponibles sur notre site.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Cordialement,<br>
              L'équipe Petits Bureaux
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 14px;">
              Cet email confirme que votre demande a été reçue et traitée.
            </p>
          </div>
        </div>
      `;
};

export const templates = {
  verificationEmail: verificationEmailTemplate,
  leadConfirmationEmail: leadConfirmationEmailTemplate,
};
