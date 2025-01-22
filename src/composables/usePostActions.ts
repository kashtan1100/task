import {computed, ref} from "vue";

export function usePostActions() {
  const posts = ref([]);
  const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"));
  const selectedPosts = ref<number[]>([]);
  const editingPostId = ref<number | null>(null);
  const editedPost = ref<any | null>(null);
  const activeComments = ref<number | null>(null);
  const perPage = ref<number>(parseInt(localStorage.getItem("perPage") || "10", 10));
  const modalVisible = ref(false);
  const currentAction = ref<'delete' | 'favorite' | null>(null);
  const modalTitle = ref('');
  const modalMessage = ref('');
  const postTitleFilter = ref('');
  const selectedUsers = ref<number[]>([]);
  const users = ref<{ id: number; name: string }[]>([]);
  const filterFavorites = ref(false);
  // Имитация функции для получения комментариев
  const fetchComments = async (postId: number) => {
    console.log(`Fetching comments for post ${postId}`);
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const cancelEditPost = () => {
    editingPostId.value = null;
    editedPost.value = null;
  };

  const deletePost = (postId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот пост?")) {
      posts.value = posts.value.filter((post) => post.id !== postId);
    }
  };

  const toggleFavorite = (postId: number) => {
    if (favorites.value.includes(postId)) {
      favorites.value = favorites.value.filter((id) => id !== postId);
    } else {
      favorites.value.push(postId);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  const handleBulkAction = async (action: "delete" | "favorite") => {
    if (selectedPosts.value.length === 0) return;

    const confirmAction = window.confirm(
        `Вы уверены, что хотите ${
            action === "delete" ? "удалить" : "добавить в избранное"
        } выбранные посты?`
    );

    if (confirmAction) {
      selectedPosts.value.forEach((postId) => {
        if (action === "delete") {
          deletePost(postId);
        } else if (action === "favorite" && !favorites.value.includes(postId)) {
          favorites.value.push(postId);
        }
      });
      selectedPosts.value = [];
      if (action === "favorite") {
        localStorage.setItem("favorites", JSON.stringify(favorites.value));
      }
    }
  };

  const editPost = (postId: number) => {
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      editedPost.value = { ...post };
      editingPostId.value = postId;
    }
  };

  const saveEditPost = () => {
    if (editedPost.value) {
      posts.value = posts.value.map((post) =>
          post.id === editingPostId.value ? { ...editedPost.value } : post
      );
      cancelEditPost();
    }
  };

  const updatePerPage = () => {
    localStorage.setItem("perPage", perPage.value.toString());
  };

  const confirmModalAction = () => {
    if (currentAction.value === "delete") {
      selectedPosts.value.forEach((postId) => {
        deletePost(postId);
      });
      selectedPosts.value = [];
    } else if (currentAction.value === "favorite") {
      selectedPosts.value.forEach((postId) => {
        if (!favorites.value.includes(postId)) {
          favorites.value.push(postId);
        }
      });
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    }

    modalVisible.value = false;
  };

  const cancelModalAction = () => {
    modalVisible.value = false;
    currentAction.value = null;
  };

  const openModal = (action: "delete" | "favorite") => {
    currentAction.value = action;

    if (action === "delete") {
      modalTitle.value = "Удалить выбранные посты";
      modalMessage.value = `Вы уверены, что хотите удалить ${selectedPosts.value.length} пост(а/ов)?`;
    } else if (action === "favorite") {
      modalTitle.value = "Добавить в избранное";
      modalMessage.value = `Вы уверены, что хотите добавить ${selectedPosts.value.length} пост(а/ов) в избранное?`;
    }

    modalVisible.value = true;
  };

  const comments = ref<{ postId: number; comments: any[] }[]>([]);
  const filteredPosts = ref([]);
  const currentPage = ref(1);


  const updateFilteredPosts = () => {
    filteredPosts.value = posts.value.filter((post: any) => {
      const matchesTitle = post.title.toLowerCase().includes(postTitleFilter.value.toLowerCase());
      const matchesUser = selectedUsers.value.length === 0 || selectedUsers.value.includes(post.userId);
      const matchesFavorites = !filterFavorites.value || favorites.value.includes(post.id);
      return matchesTitle && matchesUser && matchesFavorites;
    });
    currentPage.value = 1; // Сбрасываем на первую страницу
  };

  const displayedPosts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;

    if (perPage.value === -1) {
      return filteredPosts.value;
    }
    return filteredPosts.value.slice(start, end);
  });

  const rows = computed(() => filteredPosts.value.length);

  const fetchPostComments = async (postId: number) => {
    const existing = comments.value.find((c) => c.postId === postId);
    if (!existing) {
      const postComments = await fetchComments(postId);
      comments.value.push({ postId, comments: postComments });
    }
  };

  const showComments = async (postId: number) => {
    if (activeComments.value === postId) {
      activeComments.value = null;
    } else {
      await fetchPostComments(postId);
      activeComments.value = postId;
    }
  };

  const getUserName = (userId: number) =>
      users.value.find((u) => u.id === userId)?.name || "Неизвестный автор";

  return {
    posts,
    favorites,
    selectedPosts,
    editingPostId,
    editedPost,
    activeComments,
    perPage,
    modalVisible,
    currentAction,
    modalTitle,
    modalMessage,
    cancelEditPost,
    deletePost,
    toggleFavorite,
    handleBulkAction,
    editPost,
    saveEditPost,
    updatePerPage,
    confirmModalAction,
    cancelModalAction,
    openModal,
    showComments,
    getUserName,
    displayedPosts,
    updateFilteredPosts,
    rows,
    comments,
    postTitleFilter,
    selectedUsers,
    filterFavorites
  };
}