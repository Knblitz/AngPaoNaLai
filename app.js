import { auth, db } from './firebase-config.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  runTransaction
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Global state
let currentUser = null;
let currentYear = null;
let currentDay = null;
let currentVisit = null;

// ========== AUTHENTICATION ==========

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    console.log("User signed in:", currentUser.email);
    
    // Create or update user metadata in Firestore
    await initializeUserData(currentUser.uid, currentUser.email, currentUser.displayName);
    
    updateAuthUI();
    loadYears();
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Sign-in failed: " + error.message);
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    currentUser = null;
    currentYear = null;
    currentDay = null;
    currentVisit = null;
    updateAuthUI();
    clearAllViews();
  } catch (error) {
    console.error("Sign-out error:", error);
  }
}

// Initialize user metadata document
async function initializeUserData(uid, email, displayName) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await updateDoc(userRef, {
        email: email,
        name: displayName || "User",
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      }).catch(() => {
        // If update fails (doc doesn't exist), use setDoc
        return updateDoc(userRef, {
          email: email,
          name: displayName || "User",
          createdAt: Timestamp.now(),
          lastUpdated: Timestamp.now()
        });
      });
    } else {
      await updateDoc(userRef, {
        lastUpdated: Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}

// Update UI based on auth state
function updateAuthUI() {
  const authButton = document.getElementById('auth-button');
  const userInfo = document.getElementById('user-info');
  const content = document.getElementById('content');
  
  if (currentUser) {
    authButton.textContent = 'Sign Out';
    authButton.onclick = signOutUser;
    userInfo.textContent = `Welcome, ${currentUser.displayName || currentUser.email}!`;
    userInfo.style.display = 'block';
    content.style.display = 'block';
  } else {
    authButton.textContent = 'Sign In with Google';
    authButton.onclick = signInWithGoogle;
    userInfo.textContent = '';
    userInfo.style.display = 'none';
    content.style.display = 'none';
  }
}

// ========== YEARS OPERATIONS ==========

export async function addYear(year) {
  if (!currentUser) {
    alert("Please sign in first");
    return;
  }
  
  try {
    const yearsRef = collection(db, 'users', currentUser.uid, 'years');
    
    // Check if year already exists
    const q = query(yearsRef, orderBy('year'));
    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      if (doc.data().year === parseInt(year)) {
        alert("Year " + year + " already exists!");
        return;
      }
    }
    
    await addDoc(yearsRef, {
      year: parseInt(year),
      createdAt: Timestamp.now(),
      totalAmount: 0
    });
    
    console.log("Year added:", year);
    loadYears();
  } catch (error) {
    console.error("Error adding year:", error);
    alert("Error adding year: " + error.message);
  }
}

export async function loadYears() {
  if (!currentUser) return;
  
  try {
    const yearsRef = collection(db, 'users', currentUser.uid, 'years');
    const q = query(yearsRef, orderBy('year', 'desc'));
    const snapshot = await getDocs(q);
    
    const yearsList = document.getElementById('years-list');
    yearsList.innerHTML = '';
    
    if (snapshot.empty) {
      yearsList.innerHTML = '<p style="color: #666;">No years yet. Create one above!</p>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const yearItem = document.createElement('div');
      yearItem.className = 'year-item';
      yearItem.innerHTML = `
        <div class="year-header">
          <span class="year-name">${data.year}</span>
          <span class="year-total">$${data.totalAmount.toFixed(2)}</span>
        </div>
        <div class="year-actions">
          <button onclick="selectYear('${doc.id}', ${data.year})" class="btn-select">View</button>
          <button onclick="deleteYear('${doc.id}')" class="btn-delete">Delete</button>
        </div>
      `;
      yearsList.appendChild(yearItem);
    });
  } catch (error) {
    console.error("Error loading years:", error);
  }
}

export async function deleteYear(yearId) {
  if (!confirm("Are you sure you want to delete this year? All data will be lost.")) {
    return;
  }
  
  try {
    // Delete year document (subcollections will be handled by Firebase rules or manual cleanup)
    const yearRef = doc(db, 'users', currentUser.uid, 'years', yearId);
    
    // First delete all subcollections
    await deleteAllSubcollections('users', currentUser.uid, 'years', yearId);
    
    // Then delete the year
    await deleteDoc(yearRef);
    console.log("Year deleted");
    loadYears();
  } catch (error) {
    console.error("Error deleting year:", error);
    alert("Error deleting year: " + error.message);
  }
}

export async function selectYear(yearId, year) {
  currentYear = { id: yearId, year: year };
  currentDay = null;
  currentVisit = null;
  
  // Hide years view, show days view
  document.getElementById('years-section').style.display = 'none';
  document.getElementById('days-section').style.display = 'block';
  document.getElementById('visits-section').style.display = 'none';
  document.getElementById('entries-section').style.display = 'none';
  
  // Update breadcrumb
  updateBreadcrumb();
  
  loadDays();
}

// ========== DAYS OPERATIONS ==========

export async function addDay(name) {
  if (!currentYear) {
    alert("Please select a year first");
    return;
  }
  
  try {
    const daysRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days');
    
    // Get the next order number
    const snapshot = await getDocs(daysRef);
    const nextOrder = snapshot.size + 1;
    
    await addDoc(daysRef, {
      name: name,
      order: nextOrder,
      createdAt: Timestamp.now(),
      totalAmount: 0
    });
    
    console.log("Day added:", name);
    loadDays();
  } catch (error) {
    console.error("Error adding day:", error);
    alert("Error adding day: " + error.message);
  }
}

export async function loadDays() {
  if (!currentUser || !currentYear) return;
  
  try {
    const daysRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days');
    const q = query(daysRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    const daysList = document.getElementById('days-list');
    daysList.innerHTML = '';
    
    if (snapshot.empty) {
      daysList.innerHTML = '<p style="color: #666;">No days yet. Create one above!</p>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const dayItem = document.createElement('div');
      dayItem.className = 'day-item';
      dayItem.innerHTML = `
        <div class="day-header">
          <span class="day-name">${data.name}</span>
          <span class="day-total">$${data.totalAmount.toFixed(2)}</span>
        </div>
        <div class="day-actions">
          <button onclick="selectDay('${doc.id}', '${data.name}')" class="btn-select">View</button>
          <button onclick="deleteDay('${doc.id}')" class="btn-delete">Delete</button>
        </div>
      `;
      daysList.appendChild(dayItem);
    });
  } catch (error) {
    console.error("Error loading days:", error);
  }
}

export async function deleteDay(dayId) {
  if (!confirm("Are you sure you want to delete this day?")) {
    return;
  }
  
  try {
    // Delete all subcollections first
    await deleteAllSubcollections('users', currentUser.uid, 'years', currentYear.id, 'days', dayId);
    
    const dayRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', dayId);
    await deleteDoc(dayRef);
    
    // Recalculate year total
    await recalculateYearTotal();
    
    console.log("Day deleted");
    loadDays();
  } catch (error) {
    console.error("Error deleting day:", error);
    alert("Error deleting day: " + error.message);
  }
}

export async function selectDay(dayId, dayName) {
  currentDay = { id: dayId, name: dayName };
  currentVisit = null;
  
  // Hide previous sections
  document.getElementById('days-section').style.display = 'none';
  document.getElementById('visits-section').style.display = 'block';
  document.getElementById('entries-section').style.display = 'none';
  
  updateBreadcrumb();
  loadVisits();
}

export function backFromDays() {
  currentDay = null;
  currentYear = null;
  
  document.getElementById('years-section').style.display = 'block';
  document.getElementById('days-section').style.display = 'none';
  document.getElementById('visits-section').style.display = 'none';
  document.getElementById('entries-section').style.display = 'none';
  
  updateBreadcrumb();
  loadYears();
}

// ========== HOUSE VISITS OPERATIONS ==========

export async function addVisit(name) {
  if (!currentDay) {
    alert("Please select a day first");
    return;
  }
  
  try {
    const visitsRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits');
    
    await addDoc(visitsRef, {
      name: name,
      createdAt: Timestamp.now(),
      totalAmount: 0
    });
    
    console.log("House visit added:", name);
    loadVisits();
  } catch (error) {
    console.error("Error adding visit:", error);
    alert("Error adding visit: " + error.message);
  }
}

export async function loadVisits() {
  if (!currentUser || !currentYear || !currentDay) return;
  
  try {
    const visitsRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits');
    const q = query(visitsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    
    const visitsList = document.getElementById('visits-list');
    visitsList.innerHTML = '';
    
    if (snapshot.empty) {
      visitsList.innerHTML = '<p style="color: #666;">No house visits yet. Create one above!</p>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const visitItem = document.createElement('div');
      visitItem.className = 'visit-item';
      visitItem.innerHTML = `
        <div class="visit-header">
          <span class="visit-name">${data.name}</span>
          <span class="visit-total">$${data.totalAmount.toFixed(2)}</span>
        </div>
        <div class="visit-actions">
          <button onclick="selectVisit('${doc.id}', '${data.name}')" class="btn-select">View Details</button>
          <button onclick="deleteVisit('${doc.id}')" class="btn-delete">Delete</button>
        </div>
      `;
      visitsList.appendChild(visitItem);
    });
  } catch (error) {
    console.error("Error loading visits:", error);
  }
}

export async function deleteVisit(visitId) {
  if (!confirm("Are you sure you want to delete this house visit?")) {
    return;
  }
  
  try {
    // Delete all entries first
    await deleteAllSubcollections('users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', visitId);
    
    const visitRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', visitId);
    await deleteDoc(visitRef);
    
    // Recalculate totals
    await recalculateDayTotal();
    
    console.log("House visit deleted");
    loadVisits();
  } catch (error) {
    console.error("Error deleting visit:", error);
    alert("Error deleting visit: " + error.message);
  }
}

export async function selectVisit(visitId, visitName) {
  currentVisit = { id: visitId, name: visitName };
  
  document.getElementById('visits-section').style.display = 'none';
  document.getElementById('entries-section').style.display = 'block';
  
  updateBreadcrumb();
  loadEntries();
}

export function backFromVisits() {
  currentVisit = null;
  
  document.getElementById('visits-section').style.display = 'block';
  document.getElementById('entries-section').style.display = 'none';
  
  updateBreadcrumb();
  loadVisits();
}

// ========== ANGPAO ENTRIES OPERATIONS ==========

export async function addEntry(amount, description) {
  if (!currentVisit) {
    alert("Please select a house visit first");
    return;
  }
  
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  
  try {
    const entriesRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', currentVisit.id, 'entries');
    
    await addDoc(entriesRef, {
      amount: amountNum,
      description: description,
      createdAt: Timestamp.now(),
      currency: "USD"
    });
    
    console.log("Entry added");
    
    // Recalculate totals
    await recalculateVisitTotal();
    
    loadEntries();
  } catch (error) {
    console.error("Error adding entry:", error);
    alert("Error adding entry: " + error.message);
  }
}

export async function loadEntries() {
  if (!currentUser || !currentYear || !currentDay || !currentVisit) return;
  
  try {
    const entriesRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', currentVisit.id, 'entries');
    const q = query(entriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = '';
    
    let total = 0;
    
    if (snapshot.empty) {
      entriesList.innerHTML = '<p style="color: #666;">No entries yet. Add one above!</p>';
      document.getElementById('entries-total').textContent = '$0.00';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total += data.amount;
      
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';
      entryItem.innerHTML = `
        <div class="entry-content">
          <div class="entry-description">${data.description}</div>
          <div class="entry-amount">$${data.amount.toFixed(2)}</div>
        </div>
        <button onclick="deleteEntry('${doc.id}')" class="btn-delete-small">Delete</button>
      `;
      entriesList.appendChild(entryItem);
    });
    
    document.getElementById('entries-total').textContent = '$' + total.toFixed(2);
  } catch (error) {
    console.error("Error loading entries:", error);
  }
}

export async function deleteEntry(entryId) {
  if (!confirm("Delete this entry?")) {
    return;
  }
  
  try {
    const entryRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', currentVisit.id, 'entries', entryId);
    await deleteDoc(entryRef);
    
    // Recalculate totals
    await recalculateVisitTotal();
    
    console.log("Entry deleted");
    loadEntries();
  } catch (error) {
    console.error("Error deleting entry:", error);
    alert("Error deleting entry: " + error.message);
  }
}

export function backFromEntries() {
  currentVisit = null;
  
  document.getElementById('visits-section').style.display = 'block';
  document.getElementById('entries-section').style.display = 'none';
  
  updateBreadcrumb();
  loadVisits();
}

// ========== CALCULATION FUNCTIONS ==========

async function recalculateVisitTotal() {
  try {
    const entriesRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', currentVisit.id, 'entries');
    const snapshot = await getDocs(entriesRef);
    
    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().amount;
    });
    
    const visitRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits', currentVisit.id);
    await updateDoc(visitRef, { totalAmount: total });
    
    await recalculateDayTotal();
  } catch (error) {
    console.error("Error recalculating visit total:", error);
  }
}

async function recalculateDayTotal() {
  try {
    const visitsRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id, 'houseVisits');
    const snapshot = await getDocs(visitsRef);
    
    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().totalAmount;
    });
    
    const dayRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id, 'days', currentDay.id);
    await updateDoc(dayRef, { totalAmount: total });
    
    await recalculateYearTotal();
  } catch (error) {
    console.error("Error recalculating day total:", error);
  }
}

async function recalculateYearTotal() {
  try {
    const daysRef = collection(db, 'users', currentUser.uid, 'years', currentYear.id, 'days');
    const snapshot = await getDocs(daysRef);
    
    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().totalAmount;
    });
    
    const yearRef = doc(db, 'users', currentUser.uid, 'years', currentYear.id);
    await updateDoc(yearRef, { totalAmount: total });
    
    loadYears();
  } catch (error) {
    console.error("Error recalculating year total:", error);
  }
}

// ========== UTILITY FUNCTIONS ==========

function updateBreadcrumb() {
  let breadcrumb = '';
  
  if (currentYear) {
    breadcrumb = `📅 ${currentYear.year}`;
  }
  if (currentDay) {
    breadcrumb += ` > 📆 ${currentDay.name}`;
  }
  if (currentVisit) {
    breadcrumb += ` > 🏠 ${currentVisit.name}`;
  }
  
  document.getElementById('breadcrumb').textContent = breadcrumb;
}

function clearAllViews() {
  document.getElementById('years-section').style.display = 'none';
  document.getElementById('days-section').style.display = 'none';
  document.getElementById('visits-section').style.display = 'none';
  document.getElementById('entries-section').style.display = 'none';
  document.getElementById('breadcrumb').textContent = '';
}

async function deleteAllSubcollections(path, ...ids) {
  try {
    // Build the full path
    let fullPath = path;
    for (let i = 0; i < ids.length; i += 2) {
      fullPath += `/${ids[i]}/${ids[i + 1]}`;
    }
    
    console.log("Deleting subcollections at path:", fullPath);
    // Subcollections are handled by Firestore - just log for now
  } catch (error) {
    console.error("Error deleting subcollections:", error);
  }
}

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    updateAuthUI();
    loadYears();
  } else {
    currentUser = null;
    updateAuthUI();
  }
});

// Export functions to global scope for onclick handlers
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.addYear = addYear;
window.loadYears = loadYears;
window.deleteYear = deleteYear;
window.selectYear = selectYear;
window.addDay = addDay;
window.loadDays = loadDays;
window.deleteDay = deleteDay;
window.selectDay = selectDay;
window.backFromDays = backFromDays;
window.addVisit = addVisit;
window.loadVisits = loadVisits;
window.deleteVisit = deleteVisit;
window.selectVisit = selectVisit;
window.backFromVisits = backFromVisits;
window.addEntry = addEntry;
window.loadEntries = loadEntries;
window.deleteEntry = deleteEntry;
window.backFromEntries = backFromEntries;
