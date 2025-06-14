import Swagger from 'swagger-client';
import { userState } from '$lib/states/user.svelte.js';
import { DOCUMENT_TYPES as validLegalDocumentTypes } from '$lib/const/legal.js';
import { PUBLIC_API_URL } from '$env/static/public';

let swaggerClient = null;

export async function initSwaggerClient() {
	if (!swaggerClient) {
		swaggerClient = await Swagger(`${PUBLIC_API_URL}/api-docs`);
	}
	return swaggerClient;
}

export function getSwaggerClient() {
	if (!swaggerClient) throw new Error('Swagger client not initialized. Call initApi() first.');
	return swaggerClient;
}

class Api {
	url = $state(`${PUBLIC_API_URL}/api`);

	async getClient() {
		const client = getSwaggerClient();
		const bearerAuth = userState?.token;
		if (bearerAuth) {
			client.spec.securityDefinitions = {
				bearerAuth: { type: 'apiKey', name: 'Authorization', in: 'header' }
			};
			client.authorizations = { bearerAuth };
		}
		return client;
	}

	// --- Societies & Residences ---
	async getAllSocieties() {
		const client = await this.getClient();
		const res = await client.apis.societies.getAllSocieties();
		return res.body;
	}
	async getSocietyById(id) {
		const client = await this.getClient();
		const res = await client.apis.societies.getSocietyById({ id });
		return res.body;
	}
	async createOrUpdateSociety(societyData) {
		const client = await this.getClient();
		const res = await client.apis.societies.createOrUpdateSociety({}, { requestBody: societyData });
		return res.body;
	}
	async findSocietyByNameAndLocation({ name, city, state, country }) {
		const client = await this.getClient();
		const res = await client.apis.societies.findSocietyByNameAndLocation({
			name,
			city,
			state,
			country
		});
		return res.body;
	}
	async getUserSocieties(userId = userState.user?.id) {
		const client = await this.getClient();
		const res = await client.apis.societies.getUserSocieties({ userId });
		return res.body.map(({ society, role }) => ({ ...society, role }));
	}
	async getSocietyUsers(societyId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getSocietyUsers({ societyId });
		return res.body.map(({ user, role }) => ({ ...user, role }));
	}
	async assignUserToSociety({ societyId, userId, role }) {
		const client = await this.getClient();
		const res = await client.apis.societies.assignUserToSociety(
			{},
			{ requestBody: { societyId, userId, role } }
		);
		return res.body;
	}
	async removeUserFromSociety(societyId, userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.removeUserFromSociety({ societyId, userId });
		return res.body;
	}
	async getUserRoleInSociety(societyId, userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getUserRoleInSociety({ societyId, userId });
		return res.body;
	}

	async getAllResidencesInSociety(societyId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getAllResidencesInSociety({ societyId });
		return res.body;
	}
	async createOrUpdateResidence(residenceData) {
		const client = await this.getClient();
		const res = await client.apis.societies.createOrUpdateResidence(
			{},
			{ requestBody: residenceData }
		);
		return res.body;
	}
	async getResidenceById(id) {
		const client = await this.getClient();
		const res = await client.apis.societies.getResidenceById({ id });
		return res.body;
	}
	async getUserResidencesInSociety(societyId, userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getUserResidencesInSociety({ societyId, userId });
		return res.body;
	}
	async getUserResidences(userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getUserResidences({ userId });
		return res.body;
	}
	async findResidenceByNameInSociety(societyId, residenceName) {
		const client = await this.getClient();
		const res = await client.apis.societies.findResidenceByNameInSociety({
			societyId,
			residenceName
		});
		return res.body;
	}
	async countResidencesInSociety(societyId) {
		const client = await this.getClient();
		const res = await client.apis.societies.countResidencesInSociety({ societyId });
		return res.body;
	}
	async getResidenceUsers(residenceId) {
		const client = await this.getClient();
		const res = await client.apis.societies.getResidenceUsers({ residenceId });
		return res.body;
	}
	async assignUserToResidence(assignmentData) {
		const client = await this.getClient();
		const res = await client.apis.societies.assignUserToResidence(
			{},
			{ requestBody: assignmentData }
		);
		return res.body;
	}
	async removeUserFromResidence(residenceId, userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.removeUserFromResidence({ residenceId, userId });
		return res.body;
	}
	async isUserInResidence(residenceId, userId) {
		const client = await this.getClient();
		const res = await client.apis.societies.isUserInResidence({ residenceId, userId });
		return res.body;
	}

	// --- Users & Auth ---
	logout() {
		userState.logout();
	}
	async login({ email }) {
		const client = await this.getClient();
		return client.apis.users.login({}, { requestBody: { email } });
	}
	async register({ email, name }) {
		const client = await this.getClient();
		return client.apis.users.createUser({}, { requestBody: { name, email } });
	}
	async verifyOtp({ email, otp }) {
		const client = await this.getClient();
		const res = await client.apis.users.verifyOtp({}, { requestBody: { email, otp } });
		userState.setToken(res.body.token);
		return res;
	}
	async getUserByEmail(email = userState.user?.email) {
		const client = await this.getClient();
		const res = await client.apis.users.getUserByEmail({ email });
		return res.body;
	}
	async getUser() {
		const client = await this.getClient();
		const res = await client.apis.users.getUser();
		return res.body;
	}

	// --- Legal ---
	async getTermsOfService(locale = 'de') {
		const client = await this.getClient();
		const res = await client.apis.legal.getTermsOfService({ locale });
		return res.body;
	}
	async getPrivacyPolicy(locale = 'de') {
		const client = await this.getClient();
		const res = await client.apis.legal.getPrivacyPolicy({ locale });
		return res.body;
	}
	async getCookiePolicy(locale = 'en') {
		const client = await this.getClient();
		const res = await client.apis.legal.getCookiePolicy({ locale });
		return res.body;
	}
	async getDataProcessingInfo() {
		const client = await this.getClient();
		const res = await client.apis.legal.getDataProcessingInfo();
		return res.body;
	}
	async getLegal(type, lang = 'en') {
		if (!validLegalDocumentTypes.includes(type))
			throw new Error(`Invalid legal document type: ${type}`);
		switch (type) {
			case 'terms-of-service':
				return this.getTermsOfService(lang);
			case 'privacy-policy':
				return this.getPrivacyPolicy(lang);
			case 'cookie-policy':
				return this.getCookiePolicy(lang);
			case 'data-processing-info':
				return this.getDataProcessingInfo();
			default:
				throw new Error(`Unsupported legal document type: ${type}`);
		}
	}

	// --- GDPR ---
	async exportUserData() {
		const client = await this.getClient();
		const res = await client.apis.gdpr.exportUserData();
		return res.body;
	}
	async updateUserData(userData) {
		const client = await this.getClient();
		const res = await client.apis.gdpr.updateUserData({}, { requestBody: userData });
		return res.body;
	}
	async createDataRequest(requestType) {
		const client = await this.getClient();
		const res = await client.apis.gdpr.createDataRequest({ requestType });
		return res.body;
	}
	async deleteUserAccount(deleteCompletely = false) {
		const client = await this.getClient();
		const res = await client.apis.gdpr.deleteUserAccount({ deleteCompletely });
		return res.body;
	}

	// --- Finances ---
	async getAllExpensesBySociety(societyId) {
		const client = await this.getClient();
		const res = await client.apis.finances.getAllExpensesBySociety({ societyId });
		return res.body;
	}
	async getExpenseById(id) {
		const client = await this.getClient();
		const res = await client.apis.finances.getExpenseById({ id });
		return res.body;
	}
	async createOrUpdateExpense(expenseData) {
		const client = await this.getClient();
		const res = await client.apis.finances.createOrUpdateExpense({}, { requestBody: expenseData });
		return res.body;
	}
	async getAllExpenseDistributionsByExpenseId(expenseId) {
		const client = await this.getClient();
		const res = await client.apis.finances.getAllExpenseDistributionsByExpenseId({ expenseId });
		return res.body;
	}
	async createOrUpdateExpenseDistribution(distributionData) {
		const client = await this.getClient();
		const res = await client.apis.finances.createOrUpdateExpenseDistribution(
			{},
			{ requestBody: distributionData }
		);
		return res.body;
	}
	async getAllCalculationsByExpense(expenseId) {
		const client = await this.getClient();
		const res = await client.apis.finances.getAllCalculationsByExpense({ expenseId });
		return res.body;
	}
	async getAllCalculationsByExpenseYearMonth(expenseId, yearMonth) {
		const client = await this.getClient();
		const res = await client.apis.finances.getAllCalculationsByExpenseYearMonth({
			expenseId,
			yearMonth
		});
		return res.body;
	}
	async isCalculationForExpenseYearMonthUpdatable(expenseId, yearMonth) {
		const client = await this.getClient();
		const res = await client.apis.finances.isCalculationForExpenseYearMonthUpdatable({
			expenseId,
			yearMonth
		});
		return res.body;
	}
	async getCalculationByExpenseYearMonthResidence(expenseId, yearMonth, residenceId) {
		const client = await this.getClient();
		const res = await client.apis.finances.getCalculationByExpenseYearMonthResidence({
			expenseId,
			yearMonth,
			residenceId
		});
		return res.body;
	}
	async getAllCalculationsByExpenseFromYearMonth(expenseId, fromYearMonth) {
		const client = await this.getClient();
		const res = await client.apis.finances.getAllCalculationsByExpenseFromYearMonth({
			expenseId,
			fromYearMonth
		});
		return res.body;
	}
	async triggerCalculation(expenseId, yearMonth) {
		const client = await this.getClient();
		const res = await client.apis.finances.triggerCalculation({ expenseId, yearMonth });
		return res.body;
	}

	// --- Advertisings ---
	async getAllAdvertisements() {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAllAdvertisements();
		return res.body;
	}
	async getAdvertisementById(id) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAdvertisementById({ id });
		return res.body;
	}
	async getAdvertisementsByUserId(userId) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAdvertisementsByUserId({ userId });
		return res.body;
	}
	async getAdvertisementsBySocietyId(societyId) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAdvertisementsBySocietyId({ societyId });
		return res.body;
	}
	async createAdvertisement(adData) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.createAdvertisement({}, { requestBody: adData });
		return res.body;
	}
	async updateAdvertisement(id, adData) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.updateAdvertisement({ id }, { requestBody: adData });
		return res.body;
	}
	async getActiveAdvertisements() {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getActiveAdvertisements();
		return res.body;
	}
	async getAllAdTypes() {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAllAdTypes();
		return res.body;
	}
	async getAdTypeById(id) {
		const client = await this.getClient();
		const res = await client.apis.advertisings.getAdTypeById({ id });
		return res.body;
	}
}

export const api = new Api();
export async function initApi() {
	await initSwaggerClient();
}
