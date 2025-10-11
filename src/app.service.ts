import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tektaş Otomotiv API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }
        
        .content {
            padding: 40px;
        }
        
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        
        .info-box h2 {
            color: #667eea;
            font-size: 1.3rem;
            margin-bottom: 10px;
        }
        
        .info-box p {
            color: #555;
            line-height: 1.6;
        }
        
        .endpoints {
            margin-top: 30px;
        }
        
        .endpoint-item {
            background: #fff;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        
        .endpoint-item:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .endpoint-item strong {
            color: #667eea;
            font-size: 1.1rem;
        }
        
        .endpoint-item p {
            color: #666;
            margin-top: 5px;
        }
        
        .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #d4edda;
            color: #155724;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 20px;
        }
        
        .status::before {
            content: "●";
            font-size: 1.5rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        
        .api-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        
        .api-link:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 Tektaş Otomotiv</h1>
            <p>Yedek Parça API Servisi</p>
            <div class="status">API Aktif</div>
        </div>
        
        <div class="content">
            <div class="info-box">
                <h2>📋 Hakkında</h2>
                <p>
                    Tektaş Otomotiv Yedek Parça API Servisi, otomotiv yedek parça yönetimi için 
                    geliştirilmiş modern ve güvenilir bir REST API'dir. NestJS framework'ü ile 
                    geliştirilmiş olup, TypeORM ile veritabanı yönetimi sağlar.
                </p>
            </div>
            
            <div class="endpoints">
                <h2 style="color: #667eea; margin-bottom: 20px;">🔗 Mevcut Endpointler</h2>
                
                <div class="endpoint-item">
                    <strong>/anamenu</strong>
                    <p>Ana menü yönetimi için CRUD işlemleri</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/menu</strong>
                    <p>Menü öğeleri yönetimi</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/yetkiler</strong>
                    <p>Kullanıcı yetkilendirme ve rol yönetimi</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/kullanicilar</strong>
                    <p>Kullanıcı yönetimi ve authentication</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/sanal-magaza</strong>
                    <p>Sanal mağaza yönetimi ve konfigürasyonu</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/trendyol</strong>
                    <p>Trendyol Marketplace API entegrasyonu</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/hepsiburada</strong>
                    <p>Hepsiburada Marketplace API entegrasyonu</p>
                </div>
                
                <div class="endpoint-item">
                    <strong>/n11</strong>
                    <p>N11 Marketplace API entegrasyonu</p>
                </div>
            </div>
            
            <center>
                <a href="/api" class="api-link">📚 API Dokümantasyonu (Swagger)</a>
            </center>
        </div>
        
        <div class="footer">
            <p>© 2025 Tektaş Otomotiv - Tüm hakları saklıdır</p>
            <p style="margin-top: 5px;">Powered by NestJS & TypeORM</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}
