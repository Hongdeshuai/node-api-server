module.exports = {
	dbUrl: 'localhost:27017/inmd',
	port: 3000,
    adminTokenSecret: 'Insert Your Admin Secret Token',
    studentTokenSecret: 'Insert Your Student Secret Token',
    employerTokenSecret: 'Insert Your Employer Secret Token',
    api: '/api',
    publicPath: '../../inmd_static',
    studentPublicPath: '../../inmd_static/students',
    applicationPublicPath: '../../inmd_static/applications',
    reimbursementPublicPath: '../../inmd_static/reimbursements',
};
