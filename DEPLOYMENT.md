# 🚀 Deployment Guide – ImgLab Tools

Step-by-step guide to deploy ImgLab on various hosting platforms.

---

## 📋 Pre-Deployment Checklist

- [ ] Update version in `package.json`
- [ ] Set `NODE_ENV=production`
- [ ] Review security configurations
- [ ] Test all API endpoints
- [ ] Backup database
- [ ] Update SSL certificates (if needed)

---

## 🌐 Deploy on Heroku

### Prerequisites
```bash
brew install heroku-cli
heroku login
```

### Steps

1. **Create Heroku app:**
```bash
heroku create ImgLab-india
```

2. **Set production environment:**
```bash
heroku config:set NODE_ENV=production -a ImgLab-india
```

3. **Push to Heroku:**
```bash
git push heroku main
```

4. **View logs:**
```bash
heroku logs --tail -a ImgLab-india
```

5. **Scale dynos (optional):**
```bash
heroku ps:scale web=2 -a ImgLab-india
```

**Production URL:** `https://ImgLab-india.herokuapp.com`

---

## 🖥️ Deploy on DigitalOcean

### Prerequisites
- DigitalOcean account & API token
- SSH key configured

### Steps

1. **Create Droplet:**
   - Choose: Ubuntu 22.04 LTS
   - Size: $5-12/month (1GB RAM minimum)
   - Region: Closest to users
   - VPC: Enable for security

2. **SSH into Droplet:**
```bash
ssh root@your_droplet_ip
```

3. **Install dependencies:**
```bash
apt update && apt upgrade -y
apt install -y nodejs npm git nginx curl
```

4. **Clone repository:**
```bash
cd /var /www
git clone https://github.com/yourusername/ImgLab.git
cd ImgLab
npm install
```

5. **Configure environment:**
```bash
cp .env.example .env
nano .env  # Edit as needed
```

6. **Setup PM2 for process management:**
```bash
npm install -g pm2
pm2 start server.js --name "ImgLab"
pm2 save
pm2 startup
```

7. **Configure Nginx reverse proxy:**
```bash
nano /etc/nginx/sites-available/ImgLab
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location ~* ^/api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/ImgLab /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

8. **Setup SSL (Let's Encrypt):**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## ☁️ Deploy on AWS (Elastic Beanstalk)

### Prerequisites
```bash
brew install awscli awsebcli
aws configure
```

### Steps

1. **Initialize Elastic Beanstalk:**
```bash
eb init -p node.js-18 ImgLab-india --region us-east-1
```

2. **Create `.ebextensions/nodejs.config`:**
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    GzipCompression: "true"
  aws:autoscaling:launchconfiguration:
    InstanceType: "t3.micro"
```

3. **Create environment:**
```bash
eb create production-env
```

4. **Set environment variables:**
```bash
eb setenv NODE_ENV=production PORT=80
```

5. **Deploy:**
```bash
eb deploy
```

6. **View logs:**
```bash
eb logs
```

---

## 🐳 Deploy with Docker

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### Deploy
```bash
docker-compose up -d
```

---

## 🔄 Deploy on Vercel

### Prerequisites
```bash
npm install -g vercel
vercel login
```

### Create vercel.json
```json
{
  "buildCommand": "npm install && npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": "public"
}
```

### Deploy
```bash
vercel --prod
```

---

## 📦 Deploy on Railway

### Steps
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway auto-detects Node.js
4. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
5. Deploy automatically on push to main

---

## 🔐 Production Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring & alerts
- [ ] Configure database backups
- [ ] Setup error logging (e.g., Sentry)
- [ ] Enable CDN (e.g., Cloudflare)
- [ ] Configure firewall rules
- [ ] Setup health checks

---

## 🔒 Security Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
ENABLE_HELMET=true
ENABLE_CORS=true
LOG_LEVEL=warn
```

### Nginx Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint (Add to server.js)
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Automated Backups
```bash
# Daily backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp data/ImgLab.db backups/ImgLab_$DATE.db
```

Setup cron:
```bash
0 2 * * * /app/backup.sh
```

### Log Monitoring
Use services like:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- DataDog
- New Relic

---

## 🎯 Performance Optimization

### Enable Caching Headers
Already configured in `server.js` with 30-day cache for assets.

### Database Optimization
```javascript
// Create indexes
db.exec('CREATE INDEX idx_type_created ON calculations(type, created_at)');
```

### Load Balancing
For high traffic, setup:
```
Load Balancer → Web Server 1
              → Web Server 2
              → Web Server 3
```

---

## 🆘 Troubleshooting

### High Memory Usage
```bash
# Monitor memory
ps aux | grep node

# Restart service
pm2 restart ImgLab
```

### Database Locked
```bash
# Check for stuck processes
fuser data/ImgLab.db

# Restart API
pm2 restart ImgLab
```

### Slow Response Times
```bash
# Check database
sqlite3 data/ImgLab.db "ANALYZE;"

# Rebuild indexes
sqlite3 data/ImgLab.db "REINDEX;"
```

---

## 📚 Additional Resources

- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-on-windows-wsl/)
- [Production Checklist](https://12factor.net/)
- [SSL/TLS Security](https://certbot.eff.org/)
- [PM2 Documentation](https://pm2.keymetrics.io)

---

**Last Updated:** June 6, 2024  
**Version:** 1.0.0
