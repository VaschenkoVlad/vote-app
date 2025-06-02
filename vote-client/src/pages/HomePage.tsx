import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Poll } from '../types';
import { fetchPolls } from '../api';

export const HomePage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const getPolls = async () => {
      try {
        const data = await fetchPolls();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    getPolls();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Список голосувань</h1>
      <Link to="/polls/new" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">+ Створити нове голосування</Link>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Назва голосування</th>
            <th className="py-2 px-4 border-b">Кількість голосів</th>
            <th className="py-2 px-4 border-b">Перейти</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.id}>
              <td className="py-2 px-4 border-b">{poll.title}</td>
              <td className="py-2 px-4 border-b">{poll.votes.length}</td>
              <td className="py-2 px-4 border-b"><Link to={`/polls/${poll.id}`} className="text-red-500 hover:underline">Переглянути</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 