import { Student, StudentState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feedback } from './../../types/types';

const initialState: StudentState = {
    students: [],
    loading: false,
    error: null,
    activeStudent: null,
    courseFeedback: null
}

export const studentSlice = createSlice({
    name: "student",
    initialState: initialState,
    reducers: {
        setStudents: (state, action: PayloadAction<Student[]>) => {
            state.students = action.payload;
            state.loading = false;
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setActiveStudent: (state, action: PayloadAction<Student | null>) => {
            state.activeStudent = action.payload
        },
        setCourseFeedback: (state, action: PayloadAction<Feedback | null>) => {
            state.courseFeedback = action.payload
        }
    }
})

export const { setStudents, setLoading, setError, setActiveStudent, setCourseFeedback } = studentSlice.actions;
export default studentSlice.reducer;










