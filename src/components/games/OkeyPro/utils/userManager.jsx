// Kullanıcı ID Yönetimi
export function getUserId() {
  const storedUserId = localStorage.getItem('user_id');
  if (storedUserId) {
    return storedUserId;
  }

  const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('user_id', newUserId);
  return newUserId;
}

export function setUserId(userId) {
  localStorage.setItem('user_id', userId);
}
