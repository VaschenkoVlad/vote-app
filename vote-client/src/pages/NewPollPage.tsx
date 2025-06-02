import { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export function NewPollPage() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']); // Start with two empty options
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: string[] = [];

    if (!title.trim()) {
      currentErrors.push('Заголовок голосування не може бути порожнім.');
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      currentErrors.push('Потрібно мінімум два варіанти відповіді.');
    } else if (new Set(validOptions.map(opt => opt.toLowerCase())).size !== validOptions.length) {
        currentErrors.push('Варіанти відповіді не можуть повторюватися (без урахування регістру).');
    }

    setErrors(currentErrors);

    if (currentErrors.length > 0) {
      return;
    }

    try {
      const response = await api.post('/polls', {
        title,
        options: validOptions,
      });
      // Redirect to the new poll page or home page
      navigate(`/polls/${response.data.id}`); // Redirect to the new poll page
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrors(['Помилка при створенні голосування.']);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-10 rounded-lg shadow-2xl border border-gray-300">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Створити нове голосування</h1>
        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок голосування:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="shadow-sm block w-full border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Варіанти відповіді (мінімум 2):
            </label>
            <div id="options-container" className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="shadow-sm block w-full border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Видалити
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto"
            >
              Додати варіант
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Створити голосування
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 