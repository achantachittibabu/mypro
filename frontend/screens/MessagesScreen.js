import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Title, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const MessagesScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  
  // New chat form fields
  const [chatType, setChatType] = useState('');
  const [chatClass, setChatClass] = useState('');
  const [chatName, setChatName] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);

  // Mock data
  const typeOptions = ['Student', 'Teacher', 'Admin'];
  const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const studentNames = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson'];
  const teacherNames = ['Mr. Robert Brown', 'Mrs. Lisa Anderson', 'Dr. Michael Chang'];
  const adminNames = ['Admin 1', 'Admin 2', 'System Admin'];

  const getNameOptions = () => {
    switch (chatType) {
      case 'Student':
        return studentNames;
      case 'Teacher':
        return teacherNames;
      case 'Admin':
        return adminNames;
      default:
        return [];
    }
  };

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessagesData(response.data.data || []);
    } catch (error) {
      setMessagesData([
        { messageid: '1', sender: 'Admin', subject: 'Welcome', date: '2024-02-10', read: false },
        { messageid: '2', sender: 'Teacher', subject: 'Assignment', date: '2024-02-12', read: true },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const handleNewChat = () => {
    setChatMessages([]);
    setMessageText('');
    setChatType('');
    setChatClass('');
    setChatName('');
    setIsChatStarted(false);
    setSelectedChat({ id: Date.now(), name: 'New Chat', createdAt: new Date().toLocaleString() });
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: user?.name || 'You',
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
        isOwn: true,
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageText('');
    }
  };

  const renderMessageRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.sender || 'N/A'}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={[styles.cellText, { fontWeight: item.read ? '400' : '700' }]}>
          {item.subject || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{item.date || 'N/A'}</Text>
      </View>
      <View style={styles.tableCellAction}>
        <TouchableOpacity onPress={() => navigation.navigate('MessageDetail', { userData: user, messageData: item })} style={styles.viewButton}>
          <Icon name="eye" size={20} color="#00BCD4" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChatMessage = ({ item }) => (
    <View style={[styles.chatMessage, item.isOwn ? styles.ownMessage : styles.otherMessage]}>
      <Text style={styles.chatMessageText}>{item.text}</Text>
      <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* New Chat Button */}
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Icon name="plus-circle" size={24} color="#fff" />
        <Text style={styles.newChatButtonText}>Start New Chat</Text>
      </TouchableOpacity>

      {/* Messages List */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Messages</Title>
          <Divider style={styles.divider} />
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}><Text style={styles.headerText}>From</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Subject</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.tableCellAction}><Text style={styles.headerText}>Action</Text></View>
              </View>
              {messagesData.length > 0 ? (
                <FlatList data={messagesData} renderItem={renderMessageRow} keyExtractor={(item) => item.messageid?.toString()} scrollEnabled={false} />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="inbox" size={48} color="#ccc" />
                  <Text style={styles.noDataText}>No messages</Text>
                </View>
              )}
            </>
          )}
          <Button mode="contained" onPress={fetchMessages} style={styles.refreshButton} loading={loading}>Refresh</Button>
        </Card.Content>
      </Card>

      {/* Chat Modal */}
      <Modal visible={showChatModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.chatContainer}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.chatTitle}>{selectedChat?.name || 'Chat'}</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Form Section - Only show if chat not started yet */}
            {!isChatStarted && (
              <ScrollView style={styles.formSection}>
                {/* Type Dropdown */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Type *</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                  >
                    <Text style={styles.dropdownText}>{chatType || 'Select Type'}</Text>
                    <Icon name={showTypeDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#00BCD4" />
                  </TouchableOpacity>
                  {showTypeDropdown && (
                    <View style={styles.dropdownMenu}>
                      {typeOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setChatType(option);
                            setChatClass('');
                            setChatName('');
                            setShowTypeDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Class Dropdown - Only show for Student */}
                {chatType === 'Student' && (
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Class *</Text>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setShowClassDropdown(!showClassDropdown)}
                    >
                      <Text style={styles.dropdownText}>{chatClass || 'Select Class'}</Text>
                      <Icon name={showClassDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#00BCD4" />
                    </TouchableOpacity>
                    {showClassDropdown && (
                      <View style={styles.dropdownMenu}>
                        {classOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setChatClass(option);
                              setShowClassDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>Class {option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Name Dropdown */}
                {chatType && (
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Name *</Text>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setShowNameDropdown(!showNameDropdown)}
                    >
                      <Text style={styles.dropdownText}>{chatName || 'Select Name'}</Text>
                      <Icon name={showNameDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#00BCD4" />
                    </TouchableOpacity>
                    {showNameDropdown && (
                      <View style={styles.dropdownMenu}>
                        {getNameOptions().map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setChatName(option);
                              setShowNameDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Start Chat Button */}
                <Button
                  mode="contained"
                  style={styles.startChatButton}
                  onPress={() => {
                    if (chatType && chatName && (chatType !== 'Student' || chatClass)) {
                      setIsChatStarted(true);
                      // Update selected chat with selected info
                      setSelectedChat({
                        id: Date.now(),
                        name: chatName,
                        type: chatType,
                        class: chatClass || 'N/A',
                      });
                    }
                  }}
                >
                  Start Chat
                </Button>
              </ScrollView>
            )}

            {/* Chat Messages - Show only after form submission */}
            {isChatStarted && (
              <>
                {chatMessages.length === 0 ? (
                  <View style={styles.emptyChat}>
                    <Icon name="chat-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyChatText}>No messages yet. Start typing!</Text>
                  </View>
                ) : (
                  <FlatList
                    data={chatMessages}
                    renderItem={renderChatMessage}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.chatMessagesList}
                    contentContainerStyle={styles.chatMessagesContent}
                  />
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                  />
                  <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Icon name="send" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  newChatButton: {
    flexDirection: 'row',
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    elevation: 3,
  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: { marginBottom: 16 },
  divider: { marginVertical: 16 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#E0F2F1', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#00BCD4' },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff', marginBottom: 2 },
  tableCell: { flex: 1, justifyContent: 'center' },
  tableCellAction: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  headerText: { fontWeight: '600', fontSize: 12, color: '#00838F' },
  cellText: { fontSize: 12, color: '#333' },
  viewButton: { padding: 8, backgroundColor: '#E0F2F1', borderRadius: 4 },
  loader: { marginVertical: 20 },
  noDataContainer: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { marginTop: 12, fontSize: 14, color: '#999' },
  refreshButton: { marginTop: 16, backgroundColor: '#00BCD4' },
  // Chat Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  chatTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatMessagesList: {
    flex: 1,
  },
  chatMessagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  chatMessage: {
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: '85%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#00BCD4',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  chatMessageText: {
    fontSize: 14,
    color: '#333',
  },
  chatTimestamp: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#00BCD4',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Form Styles
  formSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  startChatButton: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#00BCD4',
  },
});

export default MessagesScreen;
