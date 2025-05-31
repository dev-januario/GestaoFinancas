import AsyncStorage from '@react-native-async-storage/async-storage';

const MONTHLY_DATA_KEY = 'monthlyData';
const THEME_KEY = 'darkMode';

// Salvar dados mensais
export const saveMonthlyData = async (monthKey, data) => {
    try {
        const allData = await getMonthlyData();
        allData[monthKey] = data;
        await AsyncStorage.setItem(MONTHLY_DATA_KEY, JSON.stringify(allData));
    } catch (error) {
        console.error('Erro ao salvar dados mensais:', error);
    }
};

// Obter todos os dados mensais
export const getMonthlyData = async () => {
    try {
        const data = await AsyncStorage.getItem(MONTHLY_DATA_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Erro ao obter dados mensais:', error);
        return {};
    }
};

// Salvar preferência de tema
export const saveThemePreference = async (isDarkMode) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    } catch (error) {
        console.error('Erro ao salvar preferência de tema:', error);
    }
};

// Obter preferência de tema
export const getThemePreference = async () => {
    try {
        const preference = await AsyncStorage.getItem(THEME_KEY);
        return preference ? JSON.parse(preference) : false;
    } catch (error) {
        console.error('Erro ao obter preferência de tema:', error);
        return false;
    }
};