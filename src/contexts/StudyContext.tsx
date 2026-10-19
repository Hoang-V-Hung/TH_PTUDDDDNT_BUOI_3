import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  createInitialStudyState,
  courses,
  studyResults,
  studySessions,
} from '../data/studyData';
import {
  loadStudyState,
  restoreStudyDefaults,
  saveStudyState,
  StudyStorageError,
} from '../services/studyStorage';
import { validateStudent } from '../utils/studyUtils';
import type { StudentChanges, StudyState } from '../types/study';

interface StudyContextValue extends StudyState {
  courses: typeof courses;
  sessions: typeof studySessions;
  results: typeof studyResults;
  loading: boolean;
  storageError: string | null;
  canRestoreDefaults: boolean;
  retryStorage: () => Promise<void>;
  restoreDefaults: () => Promise<void>;
  toggleAssignment: (id: string) => Promise<boolean>;
  updateStudent: (changes: StudentChanges) => Promise<boolean>;
}
const StudyContext = createContext<StudyContextValue | undefined>(undefined);

function storageReadMessage(error: unknown) {
  const reason =
    error instanceof StudyStorageError
      ? error.message
      : 'Chưa truy cập được bộ nhớ thiết bị.';
  return `${reason} Hãy thử lại hoặc khôi phục dữ liệu mẫu.`;
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyState>(() =>
    createInitialStudyState(),
  );
  const current = useRef(state);
  const writes = useRef<Promise<unknown>>(Promise.resolve());
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const defaults = createInitialStudyState();
      current.current = defaults;
      setState(defaults);
      setLoading(true);
      try {
        const saved = await loadStudyState();
        if (!active) {
          return;
        }
        if (saved) {
          current.current = saved;
          setState(saved);
        } else {
          await saveStudyState(defaults);
        }
        if (active) {
          setLoadFailed(false);
          setStorageError(null);
        }
      } catch (error) {
        if (active) {
          setLoadFailed(true);
          setStorageError(storageReadMessage(error));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    hydrate();
    return () => {
      active = false;
    };
  }, []);

  async function persist(next: StudyState): Promise<boolean> {
    if (loading || loadFailed) {
      return false;
    }
    current.current = next;
    setState(next);
    const write = writes.current.then(() => saveStudyState(next));
    writes.current = write.catch(() => undefined);
    try {
      await write;
      setStorageError(null);
      return true;
    } catch {
      setStorageError(
        'Thay đổi chỉ đang có trong phiên này vì chưa lưu được vào thiết bị.',
      );
      return false;
    }
  }
  async function retryStorage() {
    if (loadFailed) {
      setLoading(true);
      try {
        const saved = await loadStudyState();
        if (saved) {
          current.current = saved;
          setState(saved);
        } else {
          await saveStudyState(current.current);
        }
        setLoadFailed(false);
        setStorageError(null);
      } catch (error) {
        setStorageError(storageReadMessage(error));
      } finally {
        setLoading(false);
      }
    } else {
      await persist(current.current);
    }
  }
  async function restoreDefaults() {
    setLoading(true);
    try {
      await writes.current;
      const restored = await restoreStudyDefaults();
      current.current = restored;
      setState(restored);
      setLoadFailed(false);
      setStorageError(null);
    } catch {
      setStorageError(
        'Chưa khôi phục được dữ liệu mẫu. Dữ liệu đã lưu chưa bị xóa; vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  }
  async function toggleAssignment(id: string) {
    if (!current.current.assignments.some(item => item.id === id)) {
      return false;
    }
    return persist({
      ...current.current,
      assignments: current.current.assignments.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    });
  }
  async function updateStudent(changes: StudentChanges) {
    if (Object.keys(validateStudent(changes)).length) {
      return false;
    }
    return persist({
      ...current.current,
      student: {
        ...current.current.student,
        fullName: changes.fullName.trim(),
        email: changes.email.trim(),
        phone: changes.phone.replace(/[\s.-]/g, ''),
      },
    });
  }
  return (
    <StudyContext.Provider
      value={{
        ...state,
        courses,
        sessions: studySessions,
        results: studyResults,
        loading,
        storageError,
        canRestoreDefaults: loadFailed,
        retryStorage,
        restoreDefaults,
        toggleAssignment,
        updateStudent,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) {
    throw new Error('useStudy phải được sử dụng trong StudyProvider.');
  }
  return value;
}
