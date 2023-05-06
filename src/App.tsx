import React, { useState, useEffect, useMemo } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [listOfTodos, setTodoList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [serchQuery, setSearchQuery] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  enum Filter {
    All = 'all',
    Completed = 'completed',
    Incomplete = 'incomplete',
  }

  const filteredTodos = useMemo(() => {
    let todosToFilter: Todo[] = [...listOfTodos];

    if (filter !== Filter.All) {
      todosToFilter = todosToFilter.filter(todo => {
        return (
          filter === Filter.Completed
            ? todo.completed
            : !todo.completed
        );
      });
    }

    if (!serchQuery.trim()) {
      todosToFilter = todosToFilter.filter(todo => (
        todo.title.toLowerCase().includes(serchQuery.toLowerCase())
      ));
    }

    return todosToFilter;
  }, [listOfTodos, filter, serchQuery]);

  const getTodoList = async () => {
    const newTodoList = await getTodos();

    setTodoList(newTodoList);
    setIsLoading(false);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  const selectTodo = (todo: Todo | null) => {
    setSelectedTodo(todo);
  };

  const closeModal = () => {
    setSelectedTodo(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                setFilter={setFilter}
                setSearchQuery={setSearchQuery}
              />
            </div>

            <div className="block">
              {isLoading ? (
                <Loader />
              ) : (
                <TodoList
                  listOfTodos={filteredTodos}
                  selectedTodo={selectedTodo}
                  selectTodo={selectTodo}
                />
              )}

            </div>
          </div>
        </div>
      </div>
      {selectedTodo && (
        <TodoModal
          selectedTodo={selectedTodo}
          closeModal={closeModal}
        />
      )}
    </>
  );
};
