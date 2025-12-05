const USERS_KEY = 'fintilty_users';
const CURRENT_USER_KEY = 'fintilty_current_user';

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  register: ({ name, email, password }) => {
    if (!email || !password || !name) {
      throw new Error('Name, email, and password are required');
    }

    const users = readUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('User already exists');
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    writeUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new CustomEvent('auth-changed'));
    return newUser;
  },

  login: ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-changed'));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent('auth-changed'));
  },

  currentUser: () => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!authService.currentUser();
  }
};

