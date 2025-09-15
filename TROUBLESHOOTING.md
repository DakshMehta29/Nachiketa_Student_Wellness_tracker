# 🔧 Troubleshooting Guide - Nachiketa Wellness Platform

## 🚨 **Common Issues & Solutions**

### **Issue 1: Clerk Authentication Not Working**

**Symptoms:**
- Login button not showing
- GitHub login fails
- Authentication errors in console

**Solutions:**

1. **Set up Clerk Account:**
   ```bash
   # Run the environment setup script
   .\setup-env.bat
   ```

2. **Get Clerk Publishable Key:**
   - Go to https://dashboard.clerk.com/
   - Create a new application
   - Copy the "Publishable Key"
   - Update `.env` file:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

3. **Configure Clerk OAuth:**
   - In Clerk Dashboard → OAuth → GitHub
   - Add your GitHub OAuth App credentials
   - Set redirect URL: `http://localhost:5173`

### **Issue 2: Backend Connection Errors**

**Symptoms:**
- `ECONNREFUSED` errors
- API calls failing
- Proxy errors in Vite

**Solutions:**

1. **Check Backend is Running:**
   ```bash
   # Check if backend is running on port 3001
   netstat -an | findstr :3001
   ```

2. **Fix Vite Proxy (Already Fixed):**
   - ✅ Updated `vite.config.ts` to point to port 3001
   - ✅ Fixed proxy configuration

3. **Set up Backend Environment:**
   ```bash
   # Run environment setup
   .\setup-env.bat
   
   # Update backend/.env with your values:
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   JWT_SECRET=your_secure_random_string
   ```

### **Issue 3: Database Connection Issues**

**Symptoms:**
- Backend starts but database errors
- Supabase connection failures

**Solutions:**

1. **Set up Supabase:**
   - Go to https://supabase.com/
   - Create a new project
   - Get your project URL and API keys
   - Update `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Create Database Tables:**
   ```sql
   -- Run this in Supabase SQL Editor
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     date_of_birth DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE wellness_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     type VARCHAR(50) NOT NULL,
     data JSONB NOT NULL,
     date TIMESTAMP WITH TIME ZONE NOT NULL,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE wellness_goals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     type VARCHAR(50) NOT NULL,
     target DECIMAL NOT NULL,
     unit VARCHAR(50) NOT NULL,
     deadline TIMESTAMP WITH TIME ZONE,
     status VARCHAR(20) DEFAULT 'active',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### **Issue 4: Port Conflicts**

**Symptoms:**
- "Port already in use" errors
- Servers won't start

**Solutions:**

1. **Kill existing processes:**
   ```bash
   # Find processes using ports
   netstat -ano | findstr :3001
   netstat -ano | findstr :5173
   
   # Kill process by PID
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Use different ports:**
   - Update `backend/.env`: `PORT=3002`
   - Update `vite.config.ts`: `target: 'http://localhost:3002'`
   - Update `.env`: `VITE_API_BASE_URL=http://localhost:3002/api`

### **Issue 5: Dependencies Issues**

**Symptoms:**
- npm install fails
- Module not found errors

**Solutions:**

1. **Clear cache and reinstall:**
   ```bash
   # Frontend
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   cd ..
   ```

2. **Use specific Node version:**
   ```bash
   # Check Node version
   node --version
   # Should be 18+ for best compatibility
   ```

## 🚀 **Quick Fix Commands**

### **Complete Reset:**
```bash
# Stop all processes
taskkill /f /im node.exe

# Clean and reinstall
rm -rf node_modules backend/node_modules
rm package-lock.json backend/package-lock.json

# Setup environment
.\setup-env.bat

# Reinstall and start
npm install
cd backend && npm install && cd ..
.\start-dev.bat
```

### **Environment Setup:**
```bash
# Create environment files
.\setup-env.bat

# Edit the files with your actual values:
# - .env (Clerk key)
# - backend/.env (Supabase keys, JWT secret)
```

### **Check Status:**
```bash
# Check if servers are running
netstat -an | findstr :3001
netstat -an | findstr :5173

# Check environment files exist
dir .env
dir backend\.env
```

## 📞 **Getting Help**

If you're still having issues:

1. **Check the logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal output or `backend/logs/`

2. **Verify environment variables:**
   - Make sure all required keys are set
   - No typos in URLs or keys

3. **Test individual components:**
   - Frontend only: `npm run dev`
   - Backend only: `npm run dev:backend`

4. **Common mistakes:**
   - Forgetting to run `.\setup-env.bat`
   - Using wrong Clerk key format
   - Missing Supabase project setup
   - Port conflicts with other applications

## ✅ **Success Checklist**

- [ ] Environment files created (`.env` and `backend/.env`)
- [ ] Clerk publishable key configured
- [ ] Supabase project created and configured
- [ ] Database tables created
- [ ] Both servers start without errors
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:3001/health
- [ ] Login button appears in header
- [ ] GitHub OAuth configured in Clerk
