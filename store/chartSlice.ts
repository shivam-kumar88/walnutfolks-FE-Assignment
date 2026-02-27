import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export interface CallDurationData {
  time: string;
  calls: number;
}

export interface SadPathData {
  name: string;
  value: number;
  color: string;
}

interface ChartState {
  callDuration: CallDurationData[];
  sadPathInner: SadPathData[];
  sadPathOuter: SadPathData[];
  isLoading: boolean;
  error: string | null;
}

const defaultCallDuration: CallDurationData[] = [
  { time: '0m', calls: 10 }, { time: '1m', calls: 20 }, { time: '2m', calls: 45 },
  { time: '3m', calls: 80 }, { time: '4m', calls: 130 }, { time: '5m', calls: 150 },
  { time: '6m', calls: 120 }, { time: '7m', calls: 70 }, { time: '8m', calls: 35 },
  { time: '9m', calls: 15 }, { time: '10m', calls: 25 },
];

const defaultSadPathInner: SadPathData[] = [
  { name: 'Customer Hostility', value: 25, color: '#b2df8a' },
  { name: 'Unsupported Language', value: 35, color: '#5f9bc1' },
  { name: 'Caller Identification', value: 40, color: '#c6dbef' },
];

const defaultSadPathOuter: SadPathData[] = [
  { name: 'Verbal Aggression', value: 25, color: '#c2e699' },
  { name: 'Assistant did not speak French', value: 15, color: '#7baecc' },
  { name: 'Assistant did not speak Spanish', value: 20, color: '#88b8d6' },
  { name: 'User refused to confirm identity', value: 20, color: '#dbe9f6' },
  { name: 'Incorrect caller identity', value: 20, color: '#dbe9f6' },
];

const initialState: ChartState = {
  callDuration: defaultCallDuration,
  sadPathInner: defaultSadPathInner,
  sadPathOuter: defaultSadPathOuter,
  isLoading: false,
  error: null,
};

export const fetchUserChartData = createAsyncThunk(
  'charts/fetchUserData',
  async (userId: string, { rejectWithValue }) => {
    const supabase = getSupabaseBrowserClient();
    
    const { data, error } = await supabase
      .from('user_analytics') 
      .select('*')
      .eq('user_id', userId)
      .single();

    
    if (error && error.code !== 'PGRST116') {
      return rejectWithValue(error.message);
    }

    if (!data) return null;

    return {
      callDuration: data.call_duration,
      sadPathInner: data.sad_path_inner,
      sadPathOuter: data.sad_path_outer,
    };
  }
);


export const saveUserChartData = createAsyncThunk(
    'charts/saveUserData',
    async (
      { userId, callDuration, sadPathInner, sadPathOuter }: 
      { userId: string, callDuration: CallDurationData[], sadPathInner: SadPathData[], sadPathOuter: SadPathData[] }, 
      { rejectWithValue }
    ) => {
      const supabase = getSupabaseBrowserClient();
      
      const { error } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: userId,
          call_duration: callDuration,
          sad_path_inner: sadPathInner,
          sad_path_outer: sadPathOuter,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id' 
        });
  
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return true;
    }
  );

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    
    resetToDefaultCharts: (state) => {
      state.callDuration = defaultCallDuration;
      state.sadPathInner = defaultSadPathInner;
      state.sadPathOuter = defaultSadPathOuter;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChartData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserChartData.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload) {
          state.callDuration = action.payload.callDuration;
          state.sadPathInner = action.payload.sadPathInner;
          state.sadPathOuter = action.payload.sadPathOuter;
        } else {
          state.callDuration = defaultCallDuration;
          state.sadPathInner = defaultSadPathInner;
          state.sadPathOuter = defaultSadPathOuter;
        }
      })
      .addCase(fetchUserChartData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.callDuration = defaultCallDuration;
        state.sadPathInner = defaultSadPathInner;
        state.sadPathOuter = defaultSadPathOuter;
      })
      .addCase(saveUserChartData.fulfilled, (state, action) => {
        state.callDuration = action.meta.arg.callDuration;
        state.sadPathInner = action.meta.arg.sadPathInner;
        state.sadPathOuter = action.meta.arg.sadPathOuter;
      });
      
  },
});

export const { resetToDefaultCharts } = chartSlice.actions;
export default chartSlice.reducer;