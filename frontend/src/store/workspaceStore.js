import { create } from 'zustand';
import { getWorkspacesAPI, createWorkspaceAPI } from '../api/workspace';

const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true });
    try {
      const res = await getWorkspacesAPI();
      set({ workspaces: res.data.workspaces, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message, isLoading: false });
    }
  },

  createWorkspace: async (data) => {
    set({ isLoading: true });
    try {
      const res = await createWorkspaceAPI(data);
      const workspace = res.data.workspace;
      set(state => ({
        workspaces: [...state.workspaces, workspace],
        currentWorkspace: workspace,
        isLoading: false
      }));
      return { success: true, workspace };
    } catch (err) {
      set({ error: err.response?.data?.message, isLoading: false });
      return { success: false };
    }
  },

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));

export default useWorkspaceStore;