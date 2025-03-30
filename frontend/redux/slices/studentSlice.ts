import { Student, StudentState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StudentState = {
    students: [],
    loading: false,
    error: null,
    activeStudent: null
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
        }
    }
})

export const { setStudents, setLoading, setError, setActiveStudent } = studentSlice.actions;
export default studentSlice.reducer;










