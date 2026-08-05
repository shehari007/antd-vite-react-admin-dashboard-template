import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  List,
  Typography,
  Input,
  Button,
  Badge,
  Space,
  Divider,
  Tooltip,
  Segmented,
  Modal,
  Drawer,
  Dropdown,
  Empty,
  Descriptions,
  Grid,
  theme,
  Splitter,
  Popconfirm,
  App,
} from 'antd';
import {
  SendOutlined,
  SearchOutlined,
  PaperClipOutlined,
  CheckOutlined,
  CheckCircleFilled,
  PlusOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  StopOutlined,
  BellOutlined,
  MailOutlined,
  UserAddOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileZipOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const sharedFiles = [
  {
    name: 'project-brief.pdf',
    size: '1.2 MB',
    icon: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
  },
  {
    name: 'homepage-mockup.png',
    size: '3.4 MB',
    icon: <FileImageOutlined style={{ color: '#1677ff' }} />,
  },
  {
    name: 'assets-export.zip',
    size: '8.7 MB',
    icon: <FileZipOutlined style={{ color: '#faad14' }} />,
  },
];

const avatarUrl = (id) => `https://i.pravatar.cc/150?img=${id}`;

const people = [
  {
    key: 'emma',
    name: 'Emma Wilson',
    role: 'Product Designer',
    avatar: avatarUrl(47),
    online: true,
    email: 'emma@vitedash.com',
    phone: '+1 415 555 0132',
    bio: 'Designing delightful experiences, one pixel at a time.',
    location: 'San Francisco, CA',
    joinedAt: 'Jan 2023',
    mutual: 12,
  },
  {
    key: 'liam',
    name: 'Liam Carter',
    role: 'Frontend Engineer',
    avatar: avatarUrl(12),
    online: true,
    email: 'liam@vitedash.com',
    phone: '+1 415 555 0198',
    bio: 'React and accessibility nerd. Coffee-powered.',
    location: 'Austin, TX',
    joinedAt: 'Jun 2023',
    mutual: 8,
  },
  {
    key: 'olivia',
    name: 'Olivia Chen',
    role: 'Backend Engineer',
    avatar: avatarUrl(45),
    online: false,
    email: 'olivia@vitedash.com',
    phone: '+1 415 555 0176',
    bio: 'APIs, databases, and the occasional bug hunt.',
    location: 'Seattle, WA',
    joinedAt: 'Sep 2022',
    mutual: 5,
  },
  {
    key: 'noah',
    name: 'Noah Patel',
    role: 'QA Engineer',
    avatar: avatarUrl(33),
    online: false,
    email: 'noah@vitedash.com',
    phone: '+1 415 555 0154',
    bio: 'If it can break, I will find it first.',
    location: 'Chicago, IL',
    joinedAt: 'Nov 2023',
    mutual: 3,
  },
  {
    key: 'ava',
    name: 'Ava Martinez',
    role: 'Marketing Lead',
    avatar: avatarUrl(25),
    online: true,
    email: 'ava@vitedash.com',
    phone: '+1 415 555 0111',
    bio: 'Turning launches into stories worth sharing.',
    location: 'New York, NY',
    joinedAt: 'Mar 2023',
    mutual: 9,
  },
  {
    key: 'william',
    name: 'William Turner',
    role: 'DevOps Engineer',
    avatar: avatarUrl(53),
    online: false,
    email: 'william@vitedash.com',
    phone: '+1 415 555 0187',
    bio: 'Keeping the lights on, one deploy at a time.',
    location: 'Denver, CO',
    joinedAt: 'Feb 2024',
    mutual: 4,
  },
];

const initialRequests = [
  {
    key: 'sophia',
    name: 'Sophia Lee',
    role: 'Product Marketing',
    avatar: avatarUrl(31),
    mutual: 3,
  },
  { key: 'james', name: 'James Park', role: 'Sales', avatar: avatarUrl(15), mutual: 1 },
];

const initialThreads = [
  {
    key: 'emma',
    unread: 2,
    messages: [
      { from: 'them', text: 'Hey, are we still on for the design review?', time: '9:58 AM' },
      { from: 'me', text: 'Yes! I moved it to 3pm, works for you?', time: '10:01 AM', read: true },
      { from: 'them', text: 'Sounds good, see you at 3pm', time: '10:02 AM' },
    ],
  },
  {
    key: 'liam',
    unread: 0,
    messages: [
      { from: 'them', text: 'Pushed the fix, can you review?', time: 'Yesterday' },
      { from: 'me', text: 'On it, checking now.', time: 'Yesterday', read: true },
    ],
  },
  {
    key: 'olivia',
    unread: 0,
    messages: [
      { from: 'them', text: 'Thanks for the quick turnaround!', time: 'Mon' },
      {
        from: 'me',
        text: 'Anytime, let me know if anything else comes up.',
        time: 'Mon',
        read: true,
      },
    ],
  },
  {
    key: 'noah',
    unread: 1,
    messages: [{ from: 'them', text: 'Can we sync on the QA plan tomorrow?', time: 'Fri' }],
  },
];

const autoReplies = [
  'Got it, thanks for the update!',
  "That works for me, I'll follow up shortly.",
  'Sounds good, appreciate the heads up.',
  'Perfect, talk soon.',
];

const formatNow = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const Chat = () => {
  const { message, modal } = App.useApp();
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [contacts, setContacts] = useState(people);
  const [requests, setRequests] = useState(initialRequests);
  const [threads, setThreads] = useState(initialThreads);
  const [activeTab, setActiveTab] = useState('chats');
  const [activeKey, setActiveKey] = useState(initialThreads[0].key);
  const [mobileView, setMobileView] = useState('list');
  const [draft, setDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typingKey, setTypingKey] = useState(null);
  const [profileKey, setProfileKey] = useState(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const messagesEndRef = useRef(null);

  const getPerson = (key) =>
    contacts.find((c) => c.key === key) || requests.find((c) => c.key === key);
  const activeThread = threads.find((t) => t.key === activeKey);
  const activePerson = activeThread ? getPerson(activeThread.key) : null;
  const profilePerson = profileKey ? getPerson(profileKey) : null;

  const visibleThreads = useMemo(
    () =>
      threads
        .map((t) => ({ ...t, person: getPerson(t.key) }))
        .filter((t) => t.person && t.person.name.toLowerCase().includes(searchTerm.toLowerCase())),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threads, contacts, searchTerm]
  );

  const visibleContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleRequests = requests.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages.length, typingKey]);

  const selectConversation = (key) => {
    setActiveTab('chats');
    setActiveKey(key);
    setMobileView('thread');
    setThreads((prev) => prev.map((t) => (t.key === key ? { ...t, unread: 0 } : t)));
  };

  const closeNewChat = () => {
    setNewChatOpen(false);
    setNewChatSearch('');
  };

  const startChat = (key) => {
    setThreads((prev) =>
      prev.some((t) => t.key === key) ? prev : [...prev, { key, unread: 0, messages: [] }]
    );
    closeNewChat();
    selectConversation(key);
  };

  const appendMessage = (key, msg) => {
    setThreads((prev) =>
      prev.map((t) => (t.key === key ? { ...t, messages: [...t.messages, msg] } : t))
    );
  };

  const sendMessage = () => {
    if (!draft.trim() || !activeKey) return;
    const key = activeKey;
    appendMessage(key, { from: 'me', text: draft.trim(), time: formatNow(), read: false });
    setDraft('');

    setTypingKey(key);
    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      appendMessage(key, { from: 'them', text: reply, time: formatNow() });
      setTypingKey(null);
      setThreads((prev) =>
        prev.map((t) =>
          t.key === key ? { ...t, messages: t.messages.map((m) => ({ ...m, read: true })) } : t
        )
      );
    }, 1400);
  };

  const sendAttachment = () => {
    if (!activeKey) return;
    appendMessage(activeKey, {
      from: 'me',
      text: 'project-brief.pdf',
      time: formatNow(),
      read: false,
      attachment: true,
    });
  };

  const acceptRequest = (person) => {
    setRequests((prev) => prev.filter((r) => r.key !== person.key));
    setContacts((prev) => [
      ...prev,
      {
        ...person,
        online: false,
        email: `${person.key}@vitedash.com`,
        phone: '+1 415 555 0100',
        bio: 'New connection.',
        location: 'Unknown',
        joinedAt: 'Just now',
      },
    ]);
    message.success(`${person.name} added to your contacts`);
  };

  const declineRequest = (person) => {
    setRequests((prev) => prev.filter((r) => r.key !== person.key));
    message.info(`Declined ${person.name}'s request`);
  };

  const callDemo = (kind) => {
    message.info(`${kind} calling isn't wired up in this demo template.`);
  };

  const confirmBlock = (person) => {
    modal.confirm({
      title: 'Block contact',
      content: `Block ${person.name}? They won't be able to message you.`,
      okText: 'Block',
      okButtonProps: { danger: true },
      onOk: () => message.warning(`${person.name} would be blocked.`),
    });
  };

  const listPanel = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16, paddingBottom: 8 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>
            Messages
          </Title>
          <Tooltip title="Start a new chat">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setNewChatOpen(true)}
            />
          </Tooltip>
        </Space>
        <Segmented
          block
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { label: 'Chats', value: 'chats' },
            { label: 'Contacts', value: 'contacts' },
            {
              label: (
                <Space size={4}>
                  Requests
                  {requests.length > 0 && <Badge count={requests.length} size="small" />}
                </Space>
              ),
              value: 'requests',
            },
          ]}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder={`Search ${activeTab}`}
          variant="filled"
          allowClear
          style={{ marginTop: 12 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {activeTab === 'chats' &&
          (visibleThreads.length > 0 ? (
            <List
              dataSource={visibleThreads}
              renderItem={(item) => (
                <List.Item
                  onClick={() => selectConversation(item.key)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 16px',
                    background: item.key === activeKey ? 'rgba(22,119,255,0.08)' : 'transparent',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        dot
                        color={item.person.online ? '#52c41a' : '#d9d9d9'}
                        offset={[-4, 32]}
                      >
                        <Avatar src={item.person.avatar} />
                      </Badge>
                    }
                    title={
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text strong>{item.person.name}</Text>
                        {item.unread > 0 && <Badge count={item.unread} size="small" />}
                      </Space>
                    }
                    description={
                      <Text type="secondary" ellipsis style={{ fontSize: 12, maxWidth: 200 }}>
                        {item.messages[item.messages.length - 1]?.text || 'Say hello!'}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty style={{ marginTop: 40 }} description="No conversations yet" />
          ))}

        {activeTab === 'contacts' && (
          <List
            dataSource={visibleContacts}
            renderItem={(person) => (
              <List.Item
                style={{ padding: '10px 16px', cursor: 'pointer' }}
                onClick={() => setProfileKey(person.key)}
                actions={[
                  <Tooltip title="Message" key="message">
                    <Button
                      type="text"
                      size="small"
                      icon={<SendOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        startChat(person.key);
                      }}
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot color={person.online ? '#52c41a' : '#d9d9d9'} offset={[-4, 32]}>
                      <Avatar src={person.avatar} />
                    </Badge>
                  }
                  title={person.name}
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {person.role}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}

        {activeTab === 'requests' &&
          (visibleRequests.length > 0 ? (
            <List
              dataSource={visibleRequests}
              renderItem={(person) => (
                <List.Item style={{ padding: '10px 16px' }}>
                  <List.Item.Meta
                    avatar={<Avatar src={person.avatar} />}
                    title={person.name}
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {person.role} · {person.mutual} mutual contacts
                      </Text>
                    }
                  />
                  <Space>
                    <Popconfirm
                      title="Accept request"
                      description={`Add ${person.name} to your contacts?`}
                      okText="Accept"
                      cancelText="Cancel"
                      onConfirm={() => acceptRequest(person)}
                    >
                      <Tooltip title="Accept">
                        <Button
                          type="primary"
                          shape="circle"
                          size="small"
                          icon={<CheckOutlined />}
                        />
                      </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                      title="Decline request"
                      description={`Decline ${person.name}'s request?`}
                      okText="Decline"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => declineRequest(person)}
                    >
                      <Tooltip title="Decline">
                        <Button danger shape="circle" size="small" icon={<StopOutlined />} />
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                </List.Item>
              )}
            />
          ) : (
            <Empty style={{ marginTop: 40 }} description="No pending requests" />
          ))}
      </div>
    </div>
  );

  const threadPanel = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 320 }}>
      {activePerson ? (
        <>
          <Space style={{ padding: 16, justifyContent: 'space-between', width: '100%' }}>
            <Space>
              {!screens.sm && (
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setMobileView('list')}
                  style={{ marginInlineEnd: 4 }}
                />
              )}
              <Space style={{ cursor: 'pointer' }} onClick={() => setProfileKey(activePerson.key)}>
                <Badge dot color={activePerson.online ? '#52c41a' : '#d9d9d9'} offset={[-4, 32]}>
                  <Avatar src={activePerson.avatar} />
                </Badge>
                <Space orientation="vertical" size={0}>
                  <Text strong>{activePerson.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {activePerson.online ? 'Online' : 'Offline'}
                  </Text>
                </Space>
              </Space>
            </Space>
            <Space size={4}>
              <Tooltip title="Voice call">
                <Button type="text" icon={<PhoneOutlined />} onClick={() => callDemo('Voice')} />
              </Tooltip>
              <Tooltip title="Video call">
                <Button
                  type="text"
                  icon={<VideoCameraOutlined />}
                  onClick={() => callDemo('Video')}
                />
              </Tooltip>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: 'profile',
                      icon: <InfoCircleOutlined />,
                      label: 'View profile',
                      onClick: () => setProfileKey(activePerson.key),
                    },
                    {
                      key: 'mute',
                      icon: <BellOutlined />,
                      label: 'Mute notifications',
                      onClick: () => message.info('Notifications muted for this contact.'),
                    },
                    {
                      key: 'block',
                      icon: <StopOutlined />,
                      label: 'Block contact',
                      danger: true,
                      onClick: () => confirmBlock(activePerson),
                    },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          </Space>
          <Divider style={{ margin: 0 }} />
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <Space orientation="vertical" size={10} style={{ width: '100%' }}>
              {activeThread.messages.length === 0 && (
                <Empty
                  description={`Say hello to ${activePerson.name}`}
                  style={{ marginTop: 40 }}
                />
              )}
              {activeThread.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: msg.from === 'me' ? '#1677ff' : 'rgba(128,128,128,0.12)',
                      color: msg.from === 'me' ? '#fff' : 'inherit',
                    }}
                  >
                    {msg.attachment && <PaperClipOutlined style={{ marginRight: 6 }} />}
                    {msg.text}
                  </div>
                  <Space size={4} style={{ marginTop: 2 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {msg.time}
                    </Text>
                    {msg.from === 'me' &&
                      (msg.read ? (
                        <CheckCircleFilled style={{ fontSize: 11, color: '#1677ff' }} />
                      ) : (
                        <CheckOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
                      ))}
                  </Space>
                </div>
              ))}
              {typingKey === activeKey && (
                <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                  {activePerson.name} is typing...
                </Text>
              )}
              <div ref={messagesEndRef} />
            </Space>
          </div>
          <div style={{ padding: 16, borderTop: '1px solid rgba(128,128,128,0.2)' }}>
            <Space.Compact style={{ width: '100%' }}>
              <Tooltip title="Attach a file">
                <Button icon={<PaperClipOutlined />} onClick={sendAttachment} />
              </Tooltip>
              <Input
                placeholder="Type a message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onPressEnter={sendMessage}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
            </Space.Compact>
          </div>
        </>
      ) : (
        <Empty description="Select a conversation to get started" style={{ margin: 'auto' }} />
      )}
    </div>
  );

  return (
    <>
      <Card
        style={{ height: '100%', minHeight: 560 }}
        styles={{ body: { height: '100%', padding: 0 } }}
      >
        {screens.sm ? (
          <Splitter style={{ height: '100%' }}>
            <Splitter.Panel defaultSize="32%" min="280" max="480">
              {listPanel}
            </Splitter.Panel>
            <Splitter.Panel>{threadPanel}</Splitter.Panel>
          </Splitter>
        ) : mobileView === 'list' ? (
          listPanel
        ) : (
          threadPanel
        )}
      </Card>

      <Modal
        title="Start a new chat"
        open={newChatOpen}
        onCancel={closeNewChat}
        footer={<Button onClick={closeNewChat}>Cancel</Button>}
        width={440}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search contacts"
            variant="filled"
            allowClear
            /* Focus belongs inside a dialog the moment it opens, and this one
               exists to be typed into. */
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={newChatSearch}
            onChange={(e) => setNewChatSearch(e.target.value)}
          />

          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {['Online', 'Offline'].map((group) => {
              const groupContacts = contacts.filter(
                (person) =>
                  (group === 'Online' ? person.online : !person.online) &&
                  person.name.toLowerCase().includes(newChatSearch.toLowerCase())
              );
              if (groupContacts.length === 0) return null;
              return (
                <div key={group} style={{ marginBottom: 8 }}>
                  <Text
                    type="secondary"
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                      padding: '8px 4px',
                    }}
                  >
                    {group}
                  </Text>
                  <List
                    dataSource={groupContacts}
                    renderItem={(person) => (
                      <List.Item
                        style={{ padding: '10px 4px' }}
                        actions={[
                          <Popconfirm
                            key="add"
                            title="Start chat"
                            description={`Start a conversation with ${person.name}?`}
                            okText="Start"
                            cancelText="Cancel"
                            onConfirm={() => startChat(person.key)}
                          >
                            <Tooltip title="Start chat">
                              <Button type="text" size="small" icon={<UserAddOutlined />} />
                            </Tooltip>
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge
                              dot
                              color={person.online ? '#52c41a' : '#d9d9d9'}
                              offset={[-4, 32]}
                            >
                              <Avatar src={person.avatar} />
                            </Badge>
                          }
                          title={person.name}
                          description={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {person.role}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              );
            })}
            {contacts.filter((person) =>
              person.name.toLowerCase().includes(newChatSearch.toLowerCase())
            ).length === 0 && (
              <Empty description="No contacts found" style={{ margin: '24px 0' }} />
            )}
          </div>
        </Space>
      </Modal>

      <Drawer
        title="Profile"
        open={!!profilePerson}
        onClose={() => setProfileKey(null)}
        size={screens.xs ? '100%' : 400}
        styles={{ body: { padding: 0 } }}
      >
        {profilePerson && (
          <>
            <div
              style={{
                height: 96,
                background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
              }}
            />
            <div style={{ padding: '0 24px 24px', marginTop: -48 }}>
              <Badge dot color={profilePerson.online ? '#52c41a' : '#d9d9d9'} offset={[-10, 90]}>
                <Avatar
                  src={profilePerson.avatar}
                  size={96}
                  style={{ border: `4px solid ${colorBgContainer}` }}
                />
              </Badge>

              <Space orientation="vertical" size={2} style={{ marginTop: 12, marginBottom: 20 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {profilePerson.name}
                </Title>
                <Text type="secondary">{profilePerson.role}</Text>
                <Space size={4} style={{ marginTop: 4 }}>
                  <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {profilePerson.location}
                  </Text>
                </Space>
              </Space>

              <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    block
                    onClick={() => {
                      startChat(profilePerson.key);
                      setProfileKey(null);
                    }}
                  >
                    Message
                  </Button>
                </Col>
                <Col span={6}>
                  <Tooltip title="Voice call">
                    <Button icon={<PhoneOutlined />} block onClick={() => callDemo('Voice')} />
                  </Tooltip>
                </Col>
                <Col span={6}>
                  <Tooltip title="Video call">
                    <Button
                      icon={<VideoCameraOutlined />}
                      block
                      onClick={() => callDemo('Video')}
                    />
                  </Tooltip>
                </Col>
              </Row>

              <Card size="small" style={{ marginBottom: 24 }}>
                <Row>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Text strong style={{ display: 'block', fontSize: 16 }}>
                      {profilePerson.mutual}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Mutual
                    </Text>
                  </Col>
                  <Col
                    span={8}
                    style={{
                      textAlign: 'center',
                      borderInline: '1px solid rgba(128,128,128,0.15)',
                    }}
                  >
                    <Text strong style={{ display: 'block', fontSize: 16 }}>
                      {sharedFiles.length}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Shared Files
                    </Text>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
                      Since {profilePerson.joinedAt}
                    </Text>
                  </Col>
                </Row>
              </Card>

              <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    About
                  </Text>
                  <Text type="secondary">{profilePerson.bio}</Text>
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Contact Info
                  </Text>
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label={<MailOutlined />}>
                      {profilePerson.email}
                    </Descriptions.Item>
                    <Descriptions.Item label={<PhoneOutlined />}>
                      {profilePerson.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={<TeamOutlined />}>
                      {profilePerson.mutual} mutual contacts
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    <FileTextOutlined style={{ marginRight: 6 }} />
                    Shared Files
                  </Text>
                  <List
                    size="small"
                    dataSource={sharedFiles}
                    renderItem={(file) => (
                      <List.Item
                        actions={[<DownloadOutlined key="download" style={{ color: '#8c8c8c' }} />]}
                      >
                        <List.Item.Meta
                          avatar={<span style={{ fontSize: 18 }}>{file.icon}</span>}
                          title={<Text style={{ fontSize: 13 }}>{file.name}</Text>}
                          description={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {file.size}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>

                <Divider style={{ margin: 0 }} />

                <div>
                  <Text strong style={{ display: 'block', marginBottom: 12 }}>
                    Privacy
                  </Text>
                  <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space size={8}>
                        <BellOutlined style={{ color: '#8c8c8c' }} />
                        <Text>Mute notifications</Text>
                      </Space>
                      <Button
                        size="small"
                        onClick={() => message.info('Notifications muted for this contact.')}
                      >
                        Mute
                      </Button>
                    </Space>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space size={8}>
                        <StopOutlined style={{ color: '#ff4d4f' }} />
                        <Text>Block contact</Text>
                      </Space>
                      <Popconfirm
                        title="Block contact"
                        description={`Block ${profilePerson.name}? They won't be able to message you.`}
                        okText="Block"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => message.warning(`${profilePerson.name} would be blocked.`)}
                      >
                        <Button size="small" danger>
                          Block
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Space>
                </div>
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Chat;
