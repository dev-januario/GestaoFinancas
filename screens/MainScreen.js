import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainScreen = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [displayedMonth, setDisplayedMonth] = useState(new Date());
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [paidBillsModalVisible, setPaidBillsModalVisible] = useState(false);
    const [currentModalType, setCurrentModalType] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
        loadTheme();
    }, []);

    const loadData = async () => {
        // Implementar carregamento dos dados do AsyncStorage
    };

    const loadTheme = async () => {
        // Implementar carregamento do tema
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        // Salvar preferência do tema
    };

    const changeMonth = (direction) => {
        const newMonth = new Date(displayedMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setDisplayedMonth(newMonth);
        // Carregar dados do novo mês
    };

    const openModal = (type, item = null) => {
        setCurrentModalType(type);
        setEditingItem(item);
        setModalVisible(true);
    };

    const saveItem = () => {
        // Implementar lógica para salvar item
        setModalVisible(false);
    };

    const deleteItem = (type, id) => {
        // Implementar lógica para deletar item
    };

    const togglePaymentStatus = (expenseId) => {
        // Implementar lógica para alternar status de pagamento
    };

    const showPaidBills = () => {
        setPaidBillsModalVisible(true);
    };

    // Cálculos para o resumo
    const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
    const paidExpenses = expenses.filter(e => e.paid).reduce((sum, item) => sum + item.value, 0);
    const pendingExpenses = expenses.filter(e => !e.paid).reduce((sum, item) => sum + item.value, 0);
    const finalBalance = totalIncomes - totalExpenses;

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            {/* Cabeçalho */}
            <LinearGradient
                colors={darkMode ? ['#1a1a1a', '#333333'] : ['#007bff', '#0056b3']}
                style={styles.header}
            >
                <View style={styles.themeToggle}>
                    <TouchableOpacity onPress={toggleTheme}>
                        <Icon name={darkMode ? 'brightness-3' : 'wb-sunny'} size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerTitle}>Gestão de Finanças</Text>

                <Text style={styles.balanceLabel}>Total de Receitas</Text>
                <TouchableOpacity onPress={() => editTopIncome()}>
                    <Text style={styles.topIncome}>R$ {totalIncomes.toFixed(2)}</Text>
                </TouchableOpacity>

                {/* Seletor de Mês */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Icon name="chevron-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.monthText}>
                        {displayedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </Text>

                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Icon name="chevron-right" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Conteúdo */}
            <ScrollView style={styles.content}>
                {/* Seção de Receitas */}
                <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>💰 Receitas</Text>
                {incomes.length === 0 ? (
                    <Text style={styles.emptyMessage}>Nenhuma receita cadastrada</Text>
                ) : (
                    incomes.map(income => (
                        <IncomeItem
                            key={income.id}
                            item={income}
                            darkMode={darkMode}
                            onEdit={() => openModal('income', income)}
                            onDelete={() => deleteItem('income', income.id)}
                        />
                    ))
                )}

                {/* Seção de Despesas */}
                <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>💸 Despesas</Text>
                {expenses.length === 0 ? (
                    <Text style={styles.emptyMessage}>Nenhuma despesa cadastrada</Text>
                ) : (
                    expenses.map(expense => (
                        <ExpenseItem
                            key={expense.id}
                            item={expense}
                            darkMode={darkMode}
                            onToggleStatus={() => togglePaymentStatus(expense.id)}
                            onEdit={() => openModal('expense', expense)}
                            onDelete={() => deleteItem('expense', expense.id)}
                        />
                    ))
                )}

                {/* Resumo */}
                <View style={[styles.summary, darkMode && styles.darkSummary]}>
                    <Text style={[styles.summaryTitle, darkMode && styles.darkText]}>Resumo do Mês</Text>

                    <View style={styles.summaryRow}>
                        <Text style={darkMode ? styles.darkText : styles.lightText}>Total de Receitas:</Text>
                        <Text style={styles.incomeValue}>R$ {totalIncomes.toFixed(2)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={darkMode ? styles.darkText : styles.lightText}>Total de Despesas (Geral):</Text>
                        <Text style={styles.expenseValue}>R$ {totalExpenses.toFixed(2)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={darkMode ? styles.darkText : styles.lightText}>Despesas Pagas:</Text>
                        <Text style={styles.paidValue}>R$ {paidExpenses.toFixed(2)}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={darkMode ? styles.darkText : styles.lightText}>Despesas Pendentes:</Text>
                        <Text style={styles.pendingValue}>R$ {pendingExpenses.toFixed(2)}</Text>
                    </View>

                    <View style={[styles.finalBalance, finalBalance >= 0 ? styles.positiveBalance : styles.negativeBalance]}>
                        <Text style={styles.finalBalanceText}>Saldo Final: R$ {finalBalance.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Menu Inferior */}
            <View style={[styles.bottomMenu, darkMode && styles.darkBottomMenu]}>
                <TouchableOpacity style={styles.menuButton} onPress={() => openModal('income')}>
                    <View style={[styles.menuIcon, styles.incomeIcon]}>
                        <Text style={styles.iconText}>+</Text>
                    </View>
                    <Text style={darkMode ? styles.darkText : styles.lightText}>Receita</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => openModal('expense')}>
                    <View style={[styles.menuIcon, styles.expenseIcon]}>
                        <Text style={styles.iconText}>-</Text>
                    </View>
                    <Text style={darkMode ? styles.darkText : styles.lightText}>Despesa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={showPaidBills}>
                    <View style={[styles.menuIcon, styles.paidIcon]}>
                        <Icon name="check" size={20} color="#fff" />
                    </View>
                    <Text style={darkMode ? styles.darkText : styles.lightText}>Pagas</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para Adicionar/Editar Itens */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>
                                {editingItem ? 'Editar ' : 'Adicionar '}
                                {currentModalType === 'income' ? 'Receita' : 'Despesa'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={24} color={darkMode ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, darkMode && styles.darkText]}>Nome:</Text>
                            <TextInput
                                style={[styles.input, darkMode && styles.darkInput]}
                                placeholder="Nome do item"
                                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, darkMode && styles.darkText]}>Valor (R$):</Text>
                            <TextInput
                                style={[styles.input, darkMode && styles.darkInput]}
                                keyboardType="numeric"
                                placeholder="0,00"
                                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, darkMode && styles.darkText]}>Detalhes (opcional):</Text>
                            <TextInput
                                style={[styles.input, darkMode && styles.darkInput]}
                                placeholder="Descrição detalhada"
                                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                            />
                        </View>

                        {currentModalType === 'expense' && (
                            <View style={styles.formGroup}>
                                <Text style={[styles.label, darkMode && styles.darkText]}>Status:</Text>
                                {/* Implementar seletor de status */}
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={saveItem}
                            >
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para Contas Pagas */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={paidBillsModalVisible}
                onRequestClose={() => setPaidBillsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>Contas Pagas</Text>
                            <TouchableOpacity onPress={() => setPaidBillsModalVisible(false)}>
                                <Icon name="close" size={24} color={darkMode ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.paidBillsList}>
                            {expenses.filter(e => e.paid).length === 0 ? (
                                <Text style={styles.emptyMessage}>Nenhuma conta paga este mês</Text>
                            ) : (
                                expenses.filter(e => e.paid).map(expense => (
                                    <PaidBillItem key={expense.id} item={expense} darkMode={darkMode} />
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Componente para item de receita
const IncomeItem = ({ item, darkMode, onEdit, onDelete }) => (
    <View style={[styles.item, styles.incomeItem, darkMode && styles.darkItem]}>
        <View style={styles.itemContent}>
            <Text style={[styles.itemName, darkMode && styles.darkText]}>{item.name}</Text>
            {item.details && <Text style={[styles.itemDetails, darkMode && styles.darkDetails]}>{item.details}</Text>}
            <Text style={styles.incomeValue}>R$ {item.value.toFixed(2)}</Text>
        </View>

        <View style={styles.itemActions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Icon name="edit" size={20} color="#007bff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Icon name="delete" size={20} color="#dc3545" />
            </TouchableOpacity>
        </View>
    </View>
);

// Componente para item de despesa
const ExpenseItem = ({ item, darkMode, onToggleStatus, onEdit, onDelete }) => (
    <View style={[
        styles.item,
        item.paid ? styles.paidItem : styles.expenseItem,
        darkMode && styles.darkItem
    ]}>
        <View style={styles.itemContent}>
            <Text style={[styles.itemName, darkMode && styles.darkText]}>{item.name}</Text>
            {item.details && <Text style={[styles.itemDetails, darkMode && styles.darkDetails]}>{item.details}</Text>}
            <Text style={item.paid ? styles.paidValue : styles.expenseValue}>
                R$ {item.value.toFixed(2)}
            </Text>
        </View>

        <View style={styles.itemActions}>
            <TouchableOpacity
                onPress={onToggleStatus}
                style={[styles.paymentStatus, item.paid ? styles.paidStatus : styles.pendingStatus]}
            >
                <Icon name={item.paid ? "check-circle" : "pending"} size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Icon name="edit" size={20} color="#007bff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Icon name="delete" size={20} color="#dc3545" />
            </TouchableOpacity>
        </View>
    </View>
);

// Componente para item de conta paga
const PaidBillItem = ({ item, darkMode }) => (
    <View style={[styles.paidBillItem, darkMode && styles.darkItem]}>
        <Text style={[styles.itemName, darkMode && styles.darkText]}>
            {item.name} <Text style={styles.paidBadge}>PAGO</Text>
        </Text>
        {item.details && <Text style={[styles.itemDetails, darkMode && styles.darkDetails]}>{item.details}</Text>}
        <Text style={styles.paidValue}>R$ {item.value.toFixed(2)}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    header: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    themeToggle: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 5,
    },
    topIncome: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2ed573',
        textAlign: 'center',
        marginVertical: 10,
    },
    monthSelector: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        padding: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        color: '#fff',
        marginHorizontal: 15,
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 80,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#333',
    },
    darkSectionTitle: {
        color: '#eee',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
    darkText: {
        color: '#eee',
    },
    lightText: {
        color: '#333',
    },
    darkDetails: {
        color: '#bbb',
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    darkItem: {
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.4,
    },
    incomeItem: {
        borderLeftWidth: 5,
        borderLeftColor: '#28a745',
    },
    expenseItem: {
        borderLeftWidth: 5,
        borderLeftColor: '#dc3545',
    },
    paidItem: {
        borderLeftWidth: 5,
        borderLeftColor: '#6c757d',
        opacity: 0.9,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    itemDetails: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    incomeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
    },
    expenseValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc3545',
    },
    paidValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c757d',
    },
    pendingValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffc107',
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 10,
        padding: 5,
    },
    paymentStatus: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    paidStatus: {
        backgroundColor: '#28a745',
    },
    pendingStatus: {
        backgroundColor: '#ffc107',
    },
    summary: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        padding: 20,
        marginTop: 20,
    },
    darkSummary: {
        backgroundColor: '#222',
    },
    summaryTitle: {
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 5,
    },
    finalBalance: {
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
    },
    positiveBalance: {
        backgroundColor: 'rgba(46, 213, 115, 0.2)',
    },
    negativeBalance: {
        backgroundColor: 'rgba(255, 71, 87, 0.2)',
    },
    finalBalanceText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    darkBottomMenu: {
        backgroundColor: '#333',
        borderTopColor: '#555',
    },
    menuButton: {
        alignItems: 'center',
        padding: 8,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    incomeIcon: {
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
    },
    paidIcon: {
        backgroundColor: 'rgba(108, 117, 125, 0.2)',
    },
    iconText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    darkModalContent: {
        backgroundColor: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#555',
    },
    input: {
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    darkInput: {
        borderColor: '#555',
        backgroundColor: '#444',
        color: '#eee',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007bff',
    },
    secondaryButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    paidBillsList: {
        maxHeight: '60%',
    },
    paidBillItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    paidBadge: {
        backgroundColor: '#28a745',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 12,
    },
});

export default MainScreen;