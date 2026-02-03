import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // tu-email@gmail.com
                pass: process.env.EMAIL_PASS, // tu-app-password
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    async sendContactEmail(contactData: any) {
        console.log('email llamado')
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'leobourlot@gmail.com',
            subject: `Nueva consulta de ${contactData.serviceType || 'servicio'}`,
            html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #166534 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .info-box {
            background-color: #f0fdf4;
            border-left: 4px solid #16a34a;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        .service-badge {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #166534;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .info-value {
            color: #374151;
            font-size: 15px;
            word-break: break-word;
        }
        .message-box {
            background-color: #fafafa;
            border: 1px solid #e5e7eb;
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
            color: #374151;
            line-height: 1.6;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.5;
        }
        .cta-button {
            display: inline-block;
            background-color: #16a34a;
            color: white;
            padding: 12px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #15803d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nueva Solicitud de Asesoría</h1>
            <p>Desde tu plataforma de inmobiliaria</p>
        </div>

        <div class="content">
            <p class="greeting">¡Hola! Has recibido una nueva solicitud de asesoría inmobiliaria.</p>

            <div class="service-badge">${contactData.serviceType}</div>

            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Nombre: </span>
                    <span class="info-value">${contactData.name}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Email: </span>
                    <span class="info-value">${contactData.email}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Teléfono: </span>
                    <span class="info-value">${contactData.phone}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Servicio Solicitado: </span>
                    <span class="info-value">${this.getServiceName(contactData.serviceType) || ''}</span>
                </div>
            </div>

            ${contactData.message ? `
            <div>
                <p style="font-weight: 600; color: #166534; font-size: 14px; margin-bottom: 10px;">Mensaje del Cliente: </p>
                <div class="message-box">${contactData.message}</div>
            </div>
            ` : ''}
        </div>

        
    </div>
</body>
</html>
        `,
        };

        return await this.transporter.sendMail(mailOptions);
    }

    private getServiceName(serviceType: string): string {
        const services = {
            venta: 'Quiero Vender',
            alquiler: 'Quiero Alquilar',
            inversion: 'Quiero Invertir'
        };
        return services[serviceType] || serviceType;
    }
}
