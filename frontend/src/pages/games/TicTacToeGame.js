import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
export default function TicTacToeGame() { const navigate = useNavigate(); return (<div style={{ padding: '20px' }}><button onClick={() => navigate('/games')}>Geri</button><h1>XOX Oyunu - Yakçnda!</h1></div>); } 
