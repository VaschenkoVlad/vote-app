import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { cable } from '../cable';
import { Poll, Vote } from '../types';

export function PollPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    api.get<Poll>(`/polls/${id}`).then((res) => setPoll(res.data));
  }, [id]);

  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [poll?.id]);

  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p className="text-center text-xl text-black mt-8">Завантаження...</p>;

  return (
    <div className="container mx-auto py-8 px-4 bg-white min-h-screen text-black">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black">{poll.title}</h1>
          <button
            onClick={() => navigate(`/polls/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Редагувати
          </button>
        </div>
        <div className="flex flex-col gap-6 items-center">
          {poll.options.map((option) => (
            <button
              key={option}
              onClick={() => handleVote(option)}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-lg font-semibold"
            >
              {option} (голосів: {getCount(option)})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 