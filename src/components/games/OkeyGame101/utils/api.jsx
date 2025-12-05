// API Calls
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/gameConfig';

export async function startGame(userId) {
  const response = await axios.post(API_ENDPOINTS.GAMES.START(userId));
  return response.data;
}

export async function drawTile(gameId, fromDiscard = false) {
  const response = await axios.post(API_ENDPOINTS.GAMES.DRAW(gameId, fromDiscard));
  return response.data;
}

export async function discardTile(gameId, tileId) {
  const response = await axios.post(API_ENDPOINTS.GAMES.DISCARD(gameId, tileId));
  return response.data;
}

export async function openHand(gameId) {
  const response = await axios.post(API_ENDPOINTS.GAMES.OPEN(gameId));
  return response.data;
}

export async function addToRack(gameId, rackIndex, tileIds) {
  const response = await axios.post(API_ENDPOINTS.GAMES.RACK_ADD(gameId, rackIndex), tileIds);
  return response.data;
}
