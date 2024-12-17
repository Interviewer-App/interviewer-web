'use client'
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { register } from '@/lib/api/authentication';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconf, setPasswordconf] = useState('');
  const [role, setRole] = useState('CLIENT');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const userData = {name, email, password, role,passwordconf };
        const response = await register(userData);

        if(response){
            router.push('/login');
        }
  
        // Log in the user after successful registration
        // login({ email: response.email, role: response.role, token: response.token });
  
        // // Redirect based on role
        // if (response.role === 'ADMIN') {
        //   router.push('/admin/dashboard');
        // } else {
        //   router.push('/candidate/dashboard');
        // }
      // Call your registration API
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="passwordconf"
          value={passwordconf}
          onChange={(e) => setPasswordconf(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="CLIENT">Candidate</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;