// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVqk4DqL2RfGGE_zGd5Mz_mknqvp-2xBE",
  authDomain: "publicgames-hub.firebaseapp.com",
  databaseURL: "https://publicgames-hub-default-rtdb.firebaseio.com",
  projectId: "publicgames-hub",
  storageBucket: "publicgames-hub.firebasestorage.app",
  messagingSenderId: "209471908449",
  appId: "1:209471908449:web:ff9a0cd8fa9bdc261b9820",
  measurementId: "G-LZC848KMCV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let socket;

// Handle user login/logout
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log(result.user.displayName + ' has logged in');
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    }).catch((error) => {
        console.log(error.message);
    });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log('User logged out');
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }).catch((error) => {
        console.log(error.message);
    });
});

// Real-time Game List Fetch
db.collection('games').onSnapshot((snapshot) => {
    const gameList = document.getElementById('gameList');
    gameList.innerHTML = '';
    snapshot.forEach((doc) => {
        const game = doc.data();
        const gameItem = document.createElement('li');
        gameItem.textContent = game.name;
        gameList.appendChild(gameItem);

        gameItem.addEventListener('click', () => {
            createOrJoinRoom(game.id);
        });
    });
});

// Create or join a game room
function createOrJoinRoom(gameId) {
    console.log('Joining room for game ID:', gameId);
    socket.emit('joinRoom', gameId);
}

// Firebase authentication listener
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is logged in:', user.displayName);
    } else {
        console.log('User is logged out');
    }
});

// WebSocket connection
socket = io('https://your-backend-server.com');  // Change to your backend URL
socket.on('connect', () => {
    console.log('Connected to game server');
});
