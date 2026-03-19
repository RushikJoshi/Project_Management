import * as CompanyService from '../services/company.service.js';

export async function list(req, res, next) {
  try {
    const items = await CompanyService.listCompanies();
    return res.status(200).json({ success: true, data: items });
  } catch (e) {
    return next(e);
  }
}

export async function create(req, res, next) {
  try {
    const { name, adminName, adminEmail, adminPassword, initialUserLimit, status } = req.body;

    // #region agent log
    fetch('http://127.0.0.1:7356/ingest/f2bbb2a3-c016-48c5-8c3f-7d86788fca17',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d61fd'},body:JSON.stringify({sessionId:'1d61fd',runId:'pre-fix',hypothesisId:'H11',location:'server/src/controllers/companies.controller.js:18',message:'companies_create_called',data:{nameLen:(name||'').length,adminEmailDomain:((adminEmail||'').split('@')[1]||''),status:status||null,hasPassword:Boolean(adminPassword)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

    const created = await CompanyService.createCompanyWithAdmin({ name, adminName, adminEmail, adminPassword, initialUserLimit, status });
    return res.status(201).json({ success: true, data: created });
  } catch (e) {
    return next(e);
  }
}

