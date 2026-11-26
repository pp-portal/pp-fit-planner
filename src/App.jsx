import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dumbbell, Calendar as CalendarIcon, TrendingUp, Plus, Trash2, Check,
  ChevronLeft, ChevronRight, Clock, Award, History, Settings, Download,
  Upload, Edit3, Search, Filter, RotateCcw, Sparkles, X, Play, Pause,
  Layers, CheckCircle2, BarChart3, Info
} from 'lucide-react';

// คลังท่าออกกำลังกายตั้งต้น (ครอบคลุม Machine & Free Weight)
const DEFAULT_EXERCISES = [
  // Machine - Upper
  { id: 'ex-1', name: 'Chest Press Machine', type: 'Machine', equipment: 'SportsArt Chest Press', muscle: 'อก (Chest)', splits: ['upper', 'push', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 20, notes: 'ดันออกให้สุด คุมจังหวะผ่อนกลับช้าๆ' },
  { id: 'ex-2', name: 'Pec Fly Machine', type: 'Machine', equipment: 'Nautilus Pec Fly', muscle: 'อก (Chest)', splits: ['upper', 'push', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 15, notes: 'บีบอกเข้าหากันค้างไว้ 1 วินาที' },
  { id: 'ex-3', name: 'Rear Delt Fly Machine', type: 'Machine', equipment: 'Nautilus Rear Deltoid', muscle: 'ไหล่ (Shoulders)', splits: ['upper', 'pull', 'full'], defaultSets: 3, defaultReps: 15, defaultWeight: 15, notes: 'โฟกัสไหล่หลัง ไม่ยักไหล่' },
  { id: 'ex-4', name: 'Overhead Shoulder Press', type: 'Machine', equipment: 'Cybex VR1 Overhead Press', muscle: 'ไหล่ (Shoulders)', splits: ['upper', 'push', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 15, notes: 'ดันขึ้นเหนือศีรษะ ช่วยสร้างทรงไหล่สวย' },
  { id: 'ex-5', name: 'Lat Pulldown (Cable)', type: 'Machine', equipment: 'Cybex Bravo Pro / Cable', muscle: 'หลัง (Back)', splits: ['upper', 'pull', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 25, notes: 'ดึงลงมาที่อกบน บีบสะบักช่วยสร้างทรง V/T-shape' },
  { id: 'ex-6', name: 'Seated Cable Row', type: 'Machine', equipment: 'Cybex Bravo Pro / Cable', muscle: 'หลัง (Back)', splits: ['upper', 'pull', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 25, notes: 'หลังตรง ดึงเข้าหาช่วงเอว' },
  { id: 'ex-7', name: 'Tricep Cable Pushdown', type: 'Machine', equipment: 'Cable Machine', muscle: 'แขน (Arms)', splits: ['upper', 'push'], defaultSets: 3, defaultReps: 15, defaultWeight: 15, notes: 'ล็อกศอกแนบลำตัว กระชับท้องแขน' },

  // Machine - Lower & Core
  { id: 'ex-8', name: 'Leg Press', type: 'Machine', equipment: 'Cybex Leg Press', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs', 'full'], defaultSets: 4, defaultReps: 12, defaultWeight: 60, notes: 'วางเท้าสูงปานกลาง ดันด้วยส้นเท้า ไม่ล็อกเข่า' },
  { id: 'ex-9', name: 'Leg Extension', type: 'Machine', equipment: 'SportsArt Leg Extension', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs'], defaultSets: 3, defaultReps: 12, defaultWeight: 20, notes: 'โฟกัสหน้าขา คุมจังหวะลงช้าๆ' },
  { id: 'ex-10', name: 'Lying Leg Curl', type: 'Machine', equipment: 'SportsArt Lying Leg Curl', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs'], defaultSets: 3, defaultReps: 12, defaultWeight: 20, notes: 'โฟกัสหลังขา สะโพกติดเบาะตลอดเวลา' },
  { id: 'ex-11', name: 'Seated Leg Curl', type: 'Machine', equipment: 'SportsArt Seated Leg Curl', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs'], defaultSets: 3, defaultReps: 12, defaultWeight: 20, notes: 'พับขาเข้าหาตัวจนสุด' },
  { id: 'ex-12', name: 'Abdominal Crunch Machine', type: 'Machine', equipment: 'Cybex Prestige Ab Machine', muscle: 'หน้าท้อง (Core)', splits: ['upper', 'lower', 'legs', 'full'], defaultSets: 3, defaultReps: 15, defaultWeight: 20, notes: 'ม้วนหน้าท้องลง เกร็งท้องค้างไว้' },
  { id: 'ex-13', name: 'Smith Machine Squat', type: 'Machine', equipment: 'Cybex Smith Machine', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs', 'full'], defaultSets: 4, defaultReps: 10, defaultWeight: 20, notes: 'หย่อนสะโพกไปด้านหลัง รักษาแนวหลังตรง' },

  // Free Weight - Upper, Lower & Core
  { id: 'ex-14', name: 'Dumbbell Lateral Raise', type: 'Free Weight', equipment: 'Dumbbell', muscle: 'ไหล่ (Shoulders)', splits: ['upper', 'push', 'full'], defaultSets: 3, defaultReps: 15, defaultWeight: 4, notes: 'กางแขนออกด้านข้างระดับไหล่ สร้างหัวไหล่กลมสวย' },
  { id: 'ex-15', name: 'Dumbbell Shoulder Press', type: 'Free Weight', equipment: 'Dumbbell + Bench', muscle: 'ไหล่ (Shoulders)', splits: ['upper', 'push'], defaultSets: 3, defaultReps: 12, defaultWeight: 6, notes: 'นั่งพิงพนัก ดันดัมเบลขึ้นตรงๆ' },
  { id: 'ex-16', name: 'Dumbbell Chest Press', type: 'Free Weight', equipment: 'Dumbbell + Bench', muscle: 'อก (Chest)', splits: ['upper', 'push'], defaultSets: 3, defaultReps: 12, defaultWeight: 7.5, notes: 'กางศอกทำมุม 45 องศากับลำตัว' },
  { id: 'ex-17', name: 'One-Arm Dumbbell Row', type: 'Free Weight', equipment: 'Dumbbell + Bench', muscle: 'หลัง (Back)', splits: ['upper', 'pull'], defaultSets: 3, defaultReps: 12, defaultWeight: 10, notes: 'ดึงศอกชิดลำตัวไปด้านหลัง' },
  { id: 'ex-18', name: 'Dumbbell Bicep Curl', type: 'Free Weight', equipment: 'Dumbbell', muscle: 'แขน (Arms)', splits: ['upper', 'pull'], defaultSets: 3, defaultReps: 12, defaultWeight: 5, notes: 'ไม่เหวี่ยงตัว คุมจังหวะพับแขน' },
  { id: 'ex-19', name: 'Romanian Deadlift (RDL)', type: 'Free Weight', equipment: 'Dumbbell', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'pull', 'legs', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 12, notes: 'ดันสะโพกไปด้านหลัง รู้สึกตึงที่หลังขา' },
  { id: 'ex-20', name: 'Goblet Squat', type: 'Free Weight', equipment: 'Dumbbell / Kettlebell', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 10, notes: 'ถือน้ำหนักชิดอก ย่อตัวลงลึก' },
  { id: 'ex-21', name: 'Reverse Lunge', type: 'Free Weight', equipment: 'Dumbbell', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'legs'], defaultSets: 3, defaultReps: 10, defaultWeight: 6, notes: 'ก้าวถอยหลัง ย่อเข่าลง 90 องศา' },
  { id: 'ex-22', name: 'Kettlebell Swing', type: 'Free Weight', equipment: 'Kettlebell', muscle: 'ขา & สะโพก (Legs)', splits: ['lower', 'full'], defaultSets: 3, defaultReps: 20, defaultWeight: 6, notes: 'ใช้แรงดีดจากสะโพก เกร็งหน้าท้อง' },
  { id: 'ex-23', name: 'Ab Wheel Rollout', type: 'Free Weight', equipment: 'ลูกกลิ้งออกกำลังกาย', muscle: 'หน้าท้อง (Core)', splits: ['upper', 'lower', 'full'], defaultSets: 3, defaultReps: 12, defaultWeight: 0, notes: 'ม้วนก้นกบเล็กน้อย เกร็งแกนกลางลำตัวสร้างร่อง 11' },
];

const WORKOUT_SPLITS = [
  { id: 'upper', label: 'Upper Body', desc: 'อก หลัง ไหล่ แขน' },
  { id: 'lower', label: 'Lower Body', desc: 'ขา สะโพก หน้าท้อง' },
  { id: 'push', label: 'Push Day', desc: 'ท่าดัน (อก ไหล่ หลังแขน)' },
  { id: 'pull', label: 'Pull Day', desc: 'ท่าดึง (หลัง ไหล่หลัง หน้าแขน)' },
  { id: 'legs', label: 'Legs & Core', desc: 'ขาเน้นๆ + แกนกลางลำตัว' },
  { id: 'full', label: 'Full Body', desc: 'เล่นรวมทั่วร่างกาย' },
];

const MUSCLE_GROUPS = [
  'ทั้งหมด',
  'อก (Chest)',
  'หลัง (Back)',
  'ไหล่ (Shoulders)',
  'แขน (Arms)',
  'ขา & สะโพก (Legs)',
  'หน้าท้อง (Core)',
];

const getTodayStr = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0];
};

const formatDateThai = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

export default function App() {
  useEffect(() => {
    document.title = 'PP Fit Planner';
  }, []);

  // State หลัก
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'progress'
  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  // คลังท่าออกกำลังกาย (บันทึกลง LocalStorage)
  const [exercises, setExercises] = useState(() => {
    try {
      const saved = localStorage.getItem('skyfit_exercises_v2');
      return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
    } catch {
      return DEFAULT_EXERCISES;
    }
  });

  // บันทึกการออกกำลังกายรายวัน { [dateStr]: { splitId: string, items: [...] } }
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('skyfit_logs_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('skyfit_exercises_v2', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('skyfit_logs_v2', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // ข้อมูลของวันที่เลือกปัจจุบัน
  const currentDayData = workoutLogs[selectedDate] || { splitId: '', items: [] };
  const currentSplit = currentDayData.splitId || '';
  const currentWorkouts = currentDayData.items || [];

  // ตัวกรองคลังท่า
  const [equipmentFilter, setEquipmentFilter] = useState('All'); // 'All' | 'Machine' | 'Free Weight'
  const [muscleFilter, setMuscleFilter] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCustomFilter, setOnlyCustomFilter] = useState(false);
  const [splitEquipFilter, setSplitEquipFilter] = useState('All');

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [defaultRestTime, setDefaultRestTime] = useState(60);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restSeconds]);

  const startRestTimer = (secs = defaultRestTime) => {
    setRestSeconds(secs);
    setIsTimerRunning(true);
  };

  // Modal States
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [historyModalExId, setHistoryModalExId] = useState(null);
  const fileInputRef = useRef(null);

  // Form State สำหรับสร้าง/แก้ไขท่า
  const [exForm, setExForm] = useState({
    name: '',
    type: 'Machine',
    equipment: '',
    muscle: 'อก (Chest)',
    splits: ['upper'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 10,
    notes: ''
  });

  // ฟังก์ชันค้นหาสถิติครั้งก่อน และ PR ของแต่ละท่า
  const getExerciseStats = (exerciseId, beforeDate = null) => {
    const dates = Object.keys(workoutLogs).sort();
    let lastRecord = null;
    let maxWeight = 0;
    let historyList = [];

    dates.forEach((d) => {
      const dayItems = workoutLogs[d]?.items || [];
      const found = dayItems.find((item) => item.exerciseId === exerciseId);
      if (found && found.sets && found.sets.length > 0) {
        const completedSets = found.sets.filter((s) => s.completed);
        const validSets = completedSets.length > 0 ? completedSets : found.sets;
        const dayMax = Math.max(...validSets.map((s) => Number(s.weight) || 0));
        const dayVolume = validSets.reduce((acc, s) => acc + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);

        if (dayMax > maxWeight) maxWeight = dayMax;

        historyList.push({
          date: d,
          splitId: workoutLogs[d]?.splitId || '',
          sets: found.sets,
          maxWeight: dayMax,
          volume: dayVolume
        });

        if (!beforeDate || d < beforeDate) {
          lastRecord = {
            date: d,
            maxWeight: dayMax,
            sets: found.sets
          };
        }
      }
    });

    return { lastRecord, maxWeight, historyList };
  };

  // อัปเดตข้อมูลวันปัจจุบัน
  const updateCurrentDay = (updater) => {
    setWorkoutLogs((prev) => {
      const existing = prev[selectedDate] || { splitId: '', items: [] };
      const updated = updater(existing);
      return {
        ...prev,
        [selectedDate]: updated
      };
    });
  };

  // เลือก Split ของวันนี้
  const handleSelectSplit = (splitId) => {
    updateCurrentDay((day) => ({
      ...day,
      splitId: day.splitId === splitId ? '' : splitId
    }));
  };

  // เพิ่มท่าเข้าตารางวันนี้
  const addExerciseToWorkout = (ex) => {
    const { lastRecord } = getExerciseStats(ex.id, selectedDate);
    const initialSets = lastRecord && lastRecord.sets.length > 0
      ? lastRecord.sets.map((s, idx) => ({
          id: `${Date.now()}-${idx}-${Math.random()}`,
          weight: s.weight,
          reps: s.reps,
          completed: false
        }))
      : Array.from({ length: ex.defaultSets || 3 }, (_, idx) => ({
          id: `${Date.now()}-${idx}-${Math.random()}`,
          weight: ex.defaultWeight ?? 10,
          reps: ex.defaultReps ?? 12,
          completed: false
        }));

    updateCurrentDay((day) => ({
      ...day,
      items: [
        ...day.items,
        {
          instanceId: `${Date.now()}-${Math.random()}`,
          exerciseId: ex.id,
          sets: initialSets
        }
      ]
    }));
  };

  // โหลดชุดท่าทั้งหมดจาก Split
  const applySplitRoutine = (mode = 'append') => {
    if (!currentSplit) return;
    const recommended = exercises.filter(
      (ex) =>
        ex.splits?.includes(currentSplit) &&
        (splitEquipFilter === 'All' || ex.type === splitEquipFilter)
    );
    if (recommended.length === 0) return;

    const newItems = recommended.map((ex, i) => {
      const { lastRecord } = getExerciseStats(ex.id, selectedDate);
      const sets = lastRecord && lastRecord.sets.length > 0
        ? lastRecord.sets.map((s, idx) => ({
            id: `${Date.now()}-${i}-${idx}-${Math.random()}`,
            weight: s.weight,
            reps: s.reps,
            completed: false
          }))
        : Array.from({ length: ex.defaultSets || 3 }, (_, idx) => ({
            id: `${Date.now()}-${i}-${idx}-${Math.random()}`,
            weight: ex.defaultWeight ?? 10,
            reps: ex.defaultReps ?? 12,
            completed: false
          }));

      return {
        instanceId: `${Date.now()}-${i}-${Math.random()}`,
        exerciseId: ex.id,
        sets
      };
    });

    updateCurrentDay((day) => ({
      ...day,
      items: mode === 'replace' ? newItems : [...day.items, ...newItems]
    }));
  };

  // จัดการเซตในแต่ละท่า
  const updateSet = (instanceId, setId, field, value) => {
    updateCurrentDay((day) => ({
      ...day,
      items: day.items.map((item) => {
        if (item.instanceId !== instanceId) return item;
        return {
          ...item,
          sets: item.sets.map((s) => {
            if (s.id !== setId) return s;
            const updated = { ...s, [field]: value };
            if (field === 'completed' && value === true) {
              startRestTimer();
            }
            return updated;
          })
        };
      })
    }));
  };

  const addSetToItem = (instanceId) => {
    updateCurrentDay((day) => ({
      ...day,
      items: day.items.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const lastSet = item.sets[item.sets.length - 1] || { weight: 10, reps: 12 };
        return {
          ...item,
          sets: [
            ...item.sets,
            {
              id: `${Date.now()}-${Math.random()}`,
              weight: lastSet.weight,
              reps: lastSet.reps,
              completed: false
            }
          ]
        };
      })
    }));
  };

  const removeSetFromItem = (instanceId, setId) => {
    updateCurrentDay((day) => ({
      ...day,
      items: day.items.map((item) => {
        if (item.instanceId !== instanceId) return item;
        if (item.sets.length <= 1) return item;
        return {
          ...item,
          sets: item.sets.filter((s) => s.id !== setId)
        };
      })
    }));
  };

  const removeWorkoutItem = (instanceId) => {
    updateCurrentDay((day) => ({
      ...day,
      items: day.items.filter((item) => item.instanceId !== instanceId)
    }));
  };

  // เปิด Modal สร้าง/แก้ไขท่า
  const openCreateModal = () => {
    setEditingExercise(null);
    setExForm({
      name: '',
      type: 'Machine',
      equipment: '',
      muscle: 'อก (Chest)',
      splits: currentSplit ? [currentSplit] : ['upper'],
      defaultSets: 3,
      defaultReps: 12,
      defaultWeight: 10,
      notes: ''
    });
    setIsExModalOpen(true);
  };

  const openEditModal = (ex) => {
    setEditingExercise(ex);
    setExForm({
      name: ex.name,
      type: ex.type,
      equipment: ex.equipment || '',
      muscle: ex.muscle,
      splits: ex.splits || [],
      defaultSets: ex.defaultSets || 3,
      defaultReps: ex.defaultReps || 12,
      defaultWeight: ex.defaultWeight ?? 10,
      notes: ex.notes || ''
    });
    setIsExModalOpen(true);
  };

  const handleSaveExercise = (e) => {
    e.preventDefault();
    if (!exForm.name.trim()) return;

    if (editingExercise) {
      setExercises((prev) =>
        prev.map((item) =>
          item.id === editingExercise.id
            ? { ...item, ...exForm, name: exForm.name.trim() }
            : item
        )
      );
    } else {
      const newEx = {
        ...exForm,
        id: `custom-${Date.now()}`,
        name: exForm.name.trim(),
        isCustom: true
      };
      setExercises((prev) => [newEx, ...prev]);
    }
    setIsExModalOpen(false);
  };

  const handleDeleteCustomExercise = (id) => {
    if (window.confirm('ต้องการลบท่าออกกำลังกายนี้ออกจากคลังใช่หรือไม่?')) {
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  // Export / Import JSON
  const handleExportData = () => {
    const data = {
      app: 'PP Fit Planner',
      exportedAt: new Date().toISOString(),
      exercises,
      workoutLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pp-fit-planner-backup-${getTodayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.exercises) setExercises(parsed.exercises);
        if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
        alert('นำเข้าข้อมูลสำรองสำเร็จ!');
      } catch {
        alert('ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ JSON ที่ส่งออกจากแอปนี้');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // แถบวันที่ 7 วันรอบวันที่เลือก
  const calendarStripDays = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    const arr = [];
    for (let i = -3; i <= 3; i++) {
      const dt = new Date(base);
      dt.setDate(base.getDate() + i);
      const offset = dt.getTimezoneOffset();
      const local = new Date(dt.getTime() - offset * 60 * 1000);
      const str = local.toISOString().split('T')[0];
      const dayNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
      arr.push({
        dateStr: str,
        dayName: dayNames[dt.getDay()],
        dayNum: dt.getDate(),
        hasLog: (workoutLogs[str]?.items?.length || 0) > 0
      });
    }
    return arr;
  }, [selectedDate, workoutLogs]);

  const shiftDate = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    const offset = dt.getTimezoneOffset();
    const local = new Date(dt.getTime() - offset * 60 * 1000);
    setSelectedDate(local.toISOString().split('T')[0]);
  };

  // กรองรายการท่าในคลัง
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (equipmentFilter !== 'All' && ex.type !== equipmentFilter) return false;
      if (muscleFilter !== 'ทั้งหมด' && ex.muscle !== muscleFilter) return false;
      if (onlyCustomFilter && !ex.isCustom) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ex.name.toLowerCase().includes(q);
        const matchEquip = (ex.equipment || '').toLowerCase().includes(q);
        if (!matchName && !matchEquip) return false;
      }
      return true;
    });
  }, [exercises, equipmentFilter, muscleFilter, onlyCustomFilter, searchQuery]);

  // ท่าแนะนำตาม Split
  const splitRecommendedExercises = useMemo(() => {
    if (!currentSplit) return [];
    return exercises.filter(
      (ex) =>
        ex.splits?.includes(currentSplit) &&
        (splitEquipFilter === 'All' || ex.type === splitEquipFilter)
    );
  }, [exercises, currentSplit, splitEquipFilter]);

  // สรุปสถิติประจำวัน
  const dailySummary = useMemo(() => {
    let totalSets = 0;
    let completedSets = 0;
    let totalVolume = 0;
    currentWorkouts.forEach((item) => {
      item.sets.forEach((s) => {
        totalSets += 1;
        if (s.completed) {
          completedSets += 1;
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });
    return {
      exerciseCount: currentWorkouts.length,
      totalSets,
      completedSets,
      totalVolume
    };
  }, [currentWorkouts]);

  // State สำหรับหน้า Progress Analytics
  const [selectedProgressExId, setSelectedProgressExId] = useState(DEFAULT_EXERCISES[7].id); // Leg Press
  const [progressMetric, setProgressMetric] = useState('maxWeight'); // 'maxWeight' | 'volume'
  const [progressEquipFilter, setProgressEquipFilter] = useState('All');

  const progressStats = useMemo(() => {
    return getExerciseStats(selectedProgressExId);
  }, [selectedProgressExId, workoutLogs]);

  const selectedProgressEx = exercises.find((e) => e.id === selectedProgressExId) || exercises[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-sky-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-200">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent leading-tight">
                PP Fit Planner
              </h1>
              <p className="text-xs text-slate-400">Workout & Progress Tracker</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'workout'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>ตารางฝึกวันนี้</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'progress'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>สถิติ & พัฒนาการ</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">สร้างท่าใหม่</span>
            </button>
            <button
              onClick={handleExportData}
              title="สำรองข้อมูล (Export JSON)"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="นำเข้าข้อมูล (Import JSON)"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-5">
        {activeTab === 'workout' ? (
          <div className="space-y-6">
            {/* Date Selector & Calendar Strip */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => shiftDate(-1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 bg-sky-50/80 px-3 py-1.5 rounded-xl border border-sky-100">
                    <CalendarIcon className="w-4 h-4 text-sky-600" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => shiftDate(1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {selectedDate !== getTodayStr() && (
                    <button
                      onClick={() => setSelectedDate(getTodayStr())}
                      className="text-xs font-medium text-sky-600 hover:underline px-2"
                    >
                      กลับไปวันนี้
                    </button>
                  )}
                </div>

                {/* Rest Timer Widget */}
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-sm font-mono font-bold text-slate-700 w-12 text-center">
                    {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => (isTimerRunning ? setIsTimerRunning(false) : startRestTimer(restSeconds || defaultRestTime))}
                    className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 text-sky-600"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setRestSeconds(0);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <select
                    value={defaultRestTime}
                    onChange={(e) => setDefaultRestTime(Number(e.target.value))}
                    className="text-xs bg-transparent text-slate-500 border-l border-slate-200 pl-2 focus:outline-none"
                  >
                    <option value={45}>พัก 45วิ</option>
                    <option value={60}>พัก 60วิ</option>
                    <option value={90}>พัก 90วิ</option>
                    <option value={120}>พัก 2นาที</option>
                  </select>
                </div>
              </div>

              {/* 7-Day Strip */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarStripDays.map((day) => {
                  const isSelected = day.dateStr === selectedDate;
                  const isToday = day.dateStr === getTodayStr();
                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`flex flex-col items-center py-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white border-blue-600 shadow-sm'
                          : isToday
                          ? 'bg-sky-50/70 text-sky-800 border-sky-200'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-100'
                      }`}
                    >
                      <span className={`text-[11px] ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {day.dayName}
                      </span>
                      <span className="text-sm font-bold mt-0.5">{day.dayNum}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          day.hasLog
                            ? isSelected
                              ? 'bg-white'
                              : 'bg-sky-500'
                            : 'bg-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-white shadow-sm">
                <p className="text-xs text-sky-100">จำนวนท่าวันนี้</p>
                <p className="text-2xl font-bold mt-1">{dailySummary.exerciseCount} <span className="text-sm font-normal">ท่า</span></p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-xs text-slate-400">ความคืบหน้าเซต</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {dailySummary.completedSets}<span className="text-sm font-normal text-slate-400">/{dailySummary.totalSets} เซต</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-xs text-slate-400">Volume รวม (ที่เล่นจบ)</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {dailySummary.totalVolume.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <p className="text-xs text-slate-400">โปรแกรมวันนี้</p>
                <p className="text-base font-bold text-slate-800 mt-1.5 truncate">
                  {WORKOUT_SPLITS.find((s) => s.id === currentSplit)?.label || 'ยังไม่ระบุโปรแกรม'}
                </p>
              </div>
            </div>

            {/* Split Selector Section */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-800">เลือกโปรแกรมการฝึกวันนี้ (Workout Split)</h2>
                </div>
                {currentSplit && (
                  <button
                    onClick={() => handleSelectSplit(currentSplit)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    ล้างการเลือก
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {WORKOUT_SPLITS.map((split) => {
                  const active = currentSplit === split.id;
                  return (
                    <button
                      key={split.id}
                      onClick={() => handleSelectSplit(split.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        active
                          ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-sky-300'
                      }`}
                    >
                      <div className={`text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                        {split.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{split.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Recommended Exercises for Selected Split */}
              {currentSplit && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700">
                        ท่าแนะนำสำหรับ {WORKOUT_SPLITS.find((s) => s.id === currentSplit)?.label} ({splitRecommendedExercises.length} ท่า)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Equipment Filter inside Split */}
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                        {['All', 'Machine', 'Free Weight'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setSplitEquipFilter(t)}
                            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                              splitEquipFilter === t
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {t === 'All' ? 'ทั้งหมด' : t}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => applySplitRoutine('append')}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        + เพิ่มทั้งชุดท่า
                      </button>
                      {currentWorkouts.length > 0 && (
                        <button
                          onClick={() => applySplitRoutine('replace')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          แทนที่ตารางวันนี้
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {splitRecommendedExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="min-w-[210px] max-w-[230px] bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 rounded-xl p-2.5 flex flex-col justify-between shrink-0"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                ex.type === 'Machine'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {ex.type}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">{ex.muscle.split(' ')[0]}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{ex.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{ex.equipment}</p>
                        </div>
                        <button
                          onClick={() => addExerciseToWorkout(ex)}
                          className="mt-2 w-full py-1 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> เพิ่มเข้าตาราง
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Two Columns: Today's Workout Log & Exercise Library */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Today's Workout Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span>รายการฝึกวันที่ {formatDateThai(selectedDate)}</span>
                  </h2>
                </div>

                {currentWorkouts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-300 text-center">
                    <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-3">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">ยังไม่มีท่าออกกำลังกายในวันนี้</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      เลือกโปรแกรม Split ด้านบน หรือเลือกท่าจากคลังท่าออกกำลังกายเพื่อเริ่มบันทึกเซตและน้ำหนัก
                    </p>
                  </div>
                ) : (
                  currentWorkouts.map((item, index) => {
                    const ex = exercises.find((e) => e.id === item.exerciseId) || {
                      name: 'ท่าที่ถูกลบ',
                      type: 'Machine',
                      equipment: '-',
                      muscle: '-'
                    };
                    const { lastRecord, maxWeight } = getExerciseStats(item.exerciseId, selectedDate);

                    return (
                      <div
                        key={item.instanceId}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
                      >
                        {/* Card Header */}
                        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  ex.type === 'Machine'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {ex.type}
                              </span>
                              {ex.equipment && (
                                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {ex.equipment}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-slate-800">{ex.name}</h3>
                            {ex.notes && (
                              <p className="text-xs text-slate-400 mt-0.5">{ex.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setHistoryModalExId(item.exerciseId)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                              title="ดูประวัติย้อนหลังท่านี้"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>ประวัติ</span>
                            </button>
                            <button
                              onClick={() => removeWorkoutItem(item.instanceId)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="ลบท่านี้ออกจากวันนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Previous Stats & PR Bar */}
                        <div className="px-4 py-2 bg-sky-50/50 border-b border-sky-100/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="text-slate-600">
                            {lastRecord ? (
                              <span>
                                ครั้งก่อน ({formatDateThai(lastRecord.date)}):{' '}
                                <strong className="text-slate-800">สูงสุด {lastRecord.maxWeight} kg</strong>
                              </span>
                            ) : (
                              <span className="text-slate-400">บันทึกครั้งแรกสำหรับท่านี้</span>
                            )}
                          </div>
                          {maxWeight > 0 && (
                            <div className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Award className="w-3.5 h-3.5" />
                              <span>PR สูงสุด: {maxWeight} kg</span>
                            </div>
                          )}
                        </div>

                        {/* Sets Table */}
                        <div className="p-4">
                          <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-2 px-1">
                            <div className="col-span-2 text-center">เซต</div>
                            <div className="col-span-4 text-center">น้ำหนัก (kg)</div>
                            <div className="col-span-3 text-center">จำนวนครั้ง</div>
                            <div className="col-span-3 text-center">สำเร็จ</div>
                          </div>

                          <div className="space-y-2">
                            {item.sets.map((set, sIdx) => (
                              <div
                                key={set.id}
                                className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl border transition-colors ${
                                  set.completed
                                    ? 'bg-emerald-50/60 border-emerald-200'
                                    : 'bg-slate-50/70 border-slate-200/70'
                                }`}
                              >
                                <div className="col-span-2 flex items-center justify-center gap-1">
                                  <span className="text-xs font-bold text-slate-600">{sIdx + 1}</span>
                                  {item.sets.length > 1 && (
                                    <button
                                      onClick={() => removeSetFromItem(item.instanceId, set.id)}
                                      className="text-slate-300 hover:text-rose-500"
                                      title="ลบเซต"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>

                                <div className="col-span-4">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={set.weight}
                                    onChange={(e) =>
                                      updateSet(item.instanceId, set.id, 'weight', e.target.value)
                                    }
                                    className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
                                  />
                                </div>

                                <div className="col-span-3">
                                  <input
                                    type="number"
                                    min="1"
                                    value={set.reps}
                                    onChange={(e) =>
                                      updateSet(item.instanceId, set.id, 'reps', e.target.value)
                                    }
                                    className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
                                  />
                                </div>

                                <div className="col-span-3 flex justify-center">
                                  <button
                                    onClick={() =>
                                      updateSet(item.instanceId, set.id, 'completed', !set.completed)
                                    }
                                    className={`w-9 h-8 rounded-lg flex items-center justify-center transition-all ${
                                      set.completed
                                        ? 'bg-emerald-500 text-white shadow-sm'
                                        : 'bg-white border border-slate-300 text-slate-400 hover:border-blue-500 hover:text-blue-500'
                                    }`}
                                  >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addSetToItem(item.instanceId)}
                            className="mt-3 w-full py-1.5 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-sky-50/50 text-slate-500 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> เพิ่มเซต
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Exercise Library (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-800">คลังท่าออกกำลังกาย</h2>
                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่มท่าเอง
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อท่า หรือชื่อเครื่องเล่น..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                {/* Equipment Filter Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-3">
                  {[
                    { id: 'All', label: 'ทั้งหมด' },
                    { id: 'Machine', label: 'Machine' },
                    { id: 'Free Weight', label: 'Free Weight' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setEquipmentFilter(tab.id)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        equipmentFilter === tab.id
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Muscle Pills & Custom Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
                  <button
                    onClick={() => setOnlyCustomFilter(!onlyCustomFilter)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 border transition-colors ${
                      onlyCustomFilter
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ★ เฉพาะท่าที่สร้างเอง
                  </button>
                  {MUSCLE_GROUPS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMuscleFilter(m)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
                        muscleFilter === m
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m === 'ทั้งหมด' ? 'ทุกกล้ามเนื้อ' : m.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Exercise List */}
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {filteredExercises.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      ไม่พบท่าที่ค้นหา ลองเปลี่ยนตัวกรองหรือกด "+ เพิ่มท่าเอง"
                    </div>
                  ) : (
                    filteredExercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="p-3 rounded-xl border border-slate-200/80 hover:border-sky-300 bg-slate-50/40 hover:bg-sky-50/30 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                ex.type === 'Machine'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {ex.type}
                            </span>
                            <span className="text-[10px] text-slate-500">{ex.muscle.split(' ')[0]}</span>
                            {ex.isCustom && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                                กำหนดเอง
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-800 truncate">{ex.name}</p>
                          {ex.equipment && (
                            <p className="text-[11px] text-slate-500 truncate">{ex.equipment}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal(ex)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg"
                            title="แก้ไขข้อมูลท่า"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {ex.isCustom && (
                            <button
                              onClick={() => handleDeleteCustomExercise(ex.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg"
                              title="ลบท่า"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => addExerciseToWorkout(ex)}
                            className="ml-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> เลือก
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: PROGRESS & ANALYTICS */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>กราฟเปรียบเทียบพัฒนาการรายท่า</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    เลือกท่าออกกำลังกายเพื่อดูสถิติน้ำหนักและปริมาณการยกย้อนหลังเทียบกันแต่ละวัน
                  </p>
                </div>

                {/* Metric Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setProgressMetric('maxWeight')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      progressMetric === 'maxWeight'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    น้ำหนักสูงสุด (Max kg)
                  </button>
                  <button
                    onClick={() => setProgressMetric('volume')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      progressMetric === 'volume'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Volume รวม (kg)
                  </button>
                </div>
              </div>

              {/* Exercise Selector Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">กรองประเภทอุปกรณ์</label>
                  <select
                    value={progressEquipFilter}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProgressEquipFilter(val);
                      const firstMatch = exercises.find((ex) => val === 'All' || ex.type === val);
                      if (firstMatch) setSelectedProgressExId(firstMatch.id);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">ทั้งหมด (Machine & Free Weight)</option>
                    <option value="Machine">เฉพาะ Machine</option>
                    <option value="Free Weight">เฉพาะ Free Weight</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">เลือกท่าออกกำลังกาย</label>
                  <select
                    value={selectedProgressExId}
                    onChange={(e) => setSelectedProgressExId(e.target.value)}
                    className="w-full px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {exercises
                      .filter((ex) => progressEquipFilter === 'All' || ex.type === progressEquipFilter)
                      .map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          [{ex.type}] {ex.name} ({ex.muscle.split(' ')[0]})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Comparison Cards: First vs Latest vs PR */}
              {progressStats.historyList.length > 0 ? (
                <>
                  {(() => {
                    const list = progressStats.historyList;
                    const first = list[0];
                    const latest = list[list.length - 1];
                    const firstVal = progressMetric === 'maxWeight' ? first.maxWeight : first.volume;
                    const latestVal = progressMetric === 'maxWeight' ? latest.maxWeight : latest.volume;
                    const diff = latestVal - firstVal;
                    const pct = firstVal > 0 ? ((diff / firstVal) * 100).toFixed(1) : 0;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <p className="text-xs text-slate-500">ครั้งแรกที่บันทึก ({formatDateThai(first.date)})</p>
                          <p className="text-2xl font-bold text-slate-800 mt-1">
                            {firstVal.toLocaleString()} <span className="text-sm font-normal">kg</span>
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                          <p className="text-xs text-sky-700">ครั้งล่าสุด ({formatDateThai(latest.date)})</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-blue-700">
                              {latestVal.toLocaleString()} <span className="text-sm font-normal">kg</span>
                            </p>
                            {list.length > 1 && (
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  diff >= 0
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {diff >= 0 ? `+${diff}` : diff} kg ({diff >= 0 ? `+${pct}%` : `${pct}%`})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                          <p className="text-xs text-amber-800 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> สถิติสูงสุดตลอดกาล (PR)
                          </p>
                          <p className="text-2xl font-bold text-amber-700 mt-1">
                            {progressStats.maxWeight.toLocaleString()} <span className="text-sm font-normal">kg</span>
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Visual Bar Chart */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70 mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                      กราฟแนวโน้ม ({progressMetric === 'maxWeight' ? 'น้ำหนักสูงสุดต่อวัน' : 'Volume สะสมต่อวัน'})
                    </h3>
                    <div className="h-52 flex items-end gap-3 sm:gap-5 pt-6 pb-2 px-2 overflow-x-auto">
                      {(() => {
                        const values = progressStats.historyList.map((h) =>
                          progressMetric === 'maxWeight' ? h.maxWeight : h.volume
                        );
                        const peak = Math.max(...values, 1);

                        return progressStats.historyList.map((item) => {
                          const val = progressMetric === 'maxWeight' ? item.maxWeight : item.volume;
                          const heightPct = Math.max((val / peak) * 100, 12);
                          return (
                            <div
                              key={item.date}
                              className="flex-1 min-w-[56px] max-w-[90px] flex flex-col items-center h-full justify-end group"
                            >
                              <span className="text-xs font-bold text-blue-700 mb-1.5">
                                {val.toLocaleString()}
                              </span>
                              <div
                                style={{ height: `${heightPct}%` }}
                                className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-sky-400 group-hover:from-blue-700 group-hover:to-sky-500 transition-all shadow-xs"
                              />
                              <span className="text-[11px] font-medium text-slate-500 mt-2 whitespace-nowrap">
                                {formatDateThai(item.date)}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Detailed History Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-bold text-slate-500">
                          <th className="py-3 px-3">วันที่ฝึก</th>
                          <th className="py-3 px-3">โปรแกรม</th>
                          <th className="py-3 px-3">รายละเอียดเซต (น้ำหนัก × ครั้ง)</th>
                          <th className="py-3 px-3 text-right">สูงสุด (Max)</th>
                          <th className="py-3 px-3 text-right">Volume รวม</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {[...progressStats.historyList].reverse().map((row) => (
                          <tr key={row.date} className="hover:bg-slate-50/80">
                            <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                              {formatDateThai(row.date)}
                            </td>
                            <td className="py-3 px-3">
                              {row.splitId ? (
                                <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2 py-0.5 rounded-full">
                                  {WORKOUT_SPLITS.find((s) => s.id === row.splitId)?.label || row.splitId}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1.5">
                                {row.sets.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-xs px-2 py-0.5 rounded-md border ${
                                      s.completed
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                                        : 'bg-slate-50 border-slate-200 text-slate-500'
                                    }`}
                                  >
                                    {s.weight}kg × {s.reps}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-blue-600 whitespace-nowrap">
                              {row.maxWeight} kg
                            </td>
                            <td className="py-3 px-3 text-right font-semibold text-slate-700 whitespace-nowrap">
                              {row.volume.toLocaleString()} kg
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-semibold text-slate-600">
                    ยังไม่มีประวัติการบันทึกสำหรับท่า "{selectedProgressEx?.name}"
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ไปที่หน้า "ตารางฝึกวันนี้" เพื่อเพิ่มท่านี้และติ๊กบันทึกเซตที่เล่นเสร็จแล้ว
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create / Edit Custom Exercise */}
      {isExModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingExercise ? 'แก้ไขข้อมูลท่าออกกำลังกาย' : 'สร้างท่าออกกำลังกายใหม่ (Manual)'}
              </h3>
              <button onClick={() => setIsExModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อท่าออกกำลังกาย *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Cable Kickback, Incline Dumbbell Press"
                  value={exForm.name}
                  onChange={(e) => setExForm({ ...exForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทอุปกรณ์</label>
                  <select
                    value={exForm.type}
                    onChange={(e) => setExForm({ ...exForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Machine">Machine</option>
                    <option value="Free Weight">Free Weight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">กลุ่มกล้ามเนื้อหลัก</label>
                  <select
                    value={exForm.muscle}
                    onChange={(e) => setExForm({ ...exForm, muscle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
                  >
                    {MUSCLE_GROUPS.filter((m) => m !== 'ทั้งหมด').map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อเครื่องเล่น / อุปกรณ์เฉพาะ (ถ้ามี)</label>
                <input
                  type="text"
                  placeholder="เช่น Cybex Bravo Pro, Dumbbell, Kettlebell"
                  value={exForm.equipment}
                  onChange={(e) => setExForm({ ...exForm, equipment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">แสดงในโปรแกรม Split ไหนบ้าง</label>
                <div className="flex flex-wrap gap-1.5">
                  {WORKOUT_SPLITS.map((sp) => {
                    const checked = exForm.splits.includes(sp.id);
                    return (
                      <button
                        type="button"
                        key={sp.id}
                        onClick={() => {
                          const next = checked
                            ? exForm.splits.filter((id) => id !== sp.id)
                            : [...exForm.splits, sp.id];
                          setExForm({ ...exForm, splits: next });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          checked
                            ? 'bg-sky-100 text-blue-700 border-sky-400'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {checked ? '✓ ' : '+ '}
                        {sp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เซตเริ่มต้น</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={exForm.defaultSets}
                    onChange={(e) => setExForm({ ...exForm, defaultSets: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ครั้ง (Reps)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={exForm.defaultReps}
                    onChange={(e) => setExForm({ ...exForm, defaultReps: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">น้ำหนัก (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={exForm.defaultWeight}
                    onChange={(e) => setExForm({ ...exForm, defaultWeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">โน้ตจุดโฟกัส / ทริคการเล่น</label>
                <input
                  type="text"
                  placeholder="เช่น เกร็งหน้าท้องตลอดเวลา ไม่แอ่นหลัง"
                  value={exForm.notes}
                  onChange={(e) => setExForm({ ...exForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  บันทึกท่าออกกำลังกาย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Exercise History */}
      {historyModalExId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden">
            {(() => {
              const ex = exercises.find((e) => e.id === historyModalExId);
              const { historyList, maxWeight } = getExerciseStats(historyModalExId);
              return (
                <>
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{ex?.name}</h3>
                      <p className="text-xs text-slate-500">ประวัติการบันทึกย้อนหลังทั้งหมด ({historyList.length} ครั้ง)</p>
                    </div>
                    <button onClick={() => setHistoryModalExId(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
                    {maxWeight > 0 && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                          <Award className="w-4 h-4" /> สถิติสูงสุด (Personal Record)
                        </span>
                        <span className="font-bold text-amber-700 text-sm">{maxWeight} kg</span>
                      </div>
                    )}

                    {historyList.length === 0 ? (
                      <p className="text-center text-sm text-slate-400 py-6">ยังไม่มีประวัติการฝึกท่านี้</p>
                    ) : (
                      [...historyList].reverse().map((h) => (
                        <div key={h.date} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800">{formatDateThai(h.date)}</span>
                            <span className="text-xs font-bold text-blue-600">Max: {h.maxWeight} kg</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {h.sets.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700"
                              >
                                เซต {idx + 1}: <strong>{s.weight}kg</strong> × {s.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
