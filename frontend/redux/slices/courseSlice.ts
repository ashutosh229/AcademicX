import { Course, CourseState } from "@/lib/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
    activeCourseId: null,
}

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses = action.payload;
            state.loading = false;
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setActiveCourseId: (state, action: PayloadAction<number | null>) => {
            state.activeCourseId = action.payload;
        }
    }
})

export const { setCourses, setLoading, setError, setActiveCourseId } = courseSlice.actions;
export default courseSlice.reducer;










