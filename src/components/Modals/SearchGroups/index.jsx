import { BsFolder, BsX, BsSearch, BsFilter, BsPeople, BsCalendar, BsTag, BsStar, BsStarFill } from "react-icons/bs";
import styles from "./searchGroups.module.css";
import { ModalWindow } from "@/components/UI/ModalWindow";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export function SearchGroups({
  toggleModalSearchGroup,
  userId,
  customToastOptions,
  refresh,
}) {
  // MARK: searchGroup
  const [searchGroup, setSearchGroup] = useState("");
  const handleSearchGroup = (e) => {
    setSearchGroup(e.target.value);
  };

  // MARK: Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteGroups, setFavoriteGroups] = useState([]);

  // MARK: searchGroupResult
  const [searchGroupResult, setSearchGroupResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchSearchGroup();
  }, [searchGroup, categoryFilter, sortBy]);
  
  const fetchSearchGroup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/db?table=searchGroup&name=${searchGroup}`,
      );
      const groups = await response.json();
      
      // サンプルデータを追加（実際の実装では削除してください）
      const enhancedResults = groups.results.map((group, index) => ({
        ...group,
        description: group.description || `${group.name}は素晴らしいグループです。一緒に学び、成長しましょう！`,
        memberCount: group.memberCount || Math.floor(Math.random() * 50) + 5,
        category: group.category || ["学習", "趣味", "仕事", "その他"][Math.floor(Math.random() * 4)],
        tags: group.tags || ["プログラミング", "デザイン", "マーケティング", "ビジネス"].slice(0, Math.floor(Math.random() * 3) + 1),
        createdAt: group.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      }));
      
      // フィルタリングとソート
      let filteredResults = enhancedResults;
      if (categoryFilter !== "all") {
        filteredResults = filteredResults.filter(group => group.category === categoryFilter);
      }
      
      // ソート
      if (sortBy === "newest") {
        filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "popular") {
        filteredResults.sort((a, b) => b.memberCount - a.memberCount);
      } else if (sortBy === "alphabetical") {
        filteredResults.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      setSearchGroupResult(filteredResults);
    } catch (error) {
      console.error("グループ検索中にエラーが発生しました:", error);
      toast.error("グループの検索中にエラーが発生しました", customToastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  // MARK: requestGroup ← groupId, createdBy
  const handleRequestGroup = async (e, groupId, createdBy) => {
    e.preventDefault();
    try {
      await fetch(
        `/api/post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: "requestGroup",
            groupId: groupId,
            fromUserId: userId,
            toUserId: createdBy,
          }),
        },
      );
      refresh();
      toast.success("グループ参加リクエストを送信しました", customToastOptions);
    } catch (error) {
      console.error("リクエスト送信中にエラーが発生しました:", error);
      toast.error("リクエストの送信に失敗しました", customToastOptions);
    }
  };

  // お気に入り機能
  const toggleFavorite = (groupId) => {
    setFavoriteGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
    toast.success(
      favoriteGroups.includes(groupId) 
        ? "お気に入りから削除しました" 
        : "お気に入りに追加しました", 
      customToastOptions
    );
  };

  // カテゴリーリスト
  const categories = ["all", "学習", "趣味", "仕事", "その他"];
  
  return (
    <ModalWindow>
      {/* ヘッダー */}
      <div className={styles.searchGroupHeader}>
        <h2 className={styles.searchGroupTitle}>グループを探す</h2>
        <button
          className={styles.searchGroupClose}
          onClick={toggleModalSearchGroup}
          aria-label="閉じる"
        >
          <BsX />
        </button>
      </div>

      {/* コンテンツ */}
      <div className={styles.searchGroupContent}>
        {/* 検索フォーム */}
        <div className={styles.searchGroupForm}>
          <div className={styles.searchInputWrapper}>
            <BsSearch className={styles.searchIcon} />
            <input
              className={styles.searchGroupInput}
              type="text"
              placeholder="グループ名で検索"
              onChange={handleSearchGroup}
              value={searchGroup}
            />
            <button 
              className={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="フィルター"
            >
              <BsFilter />
            </button>
          </div>
          
          {/* フィルターパネル */}
          {showFilters && (
            <div className={styles.filterPanel}>
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>カテゴリー</h3>
                <div className={styles.categoryButtons}>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`${styles.categoryButton} ${categoryFilter === category ? styles.categoryButtonActive : ''}`}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category === "all" ? "すべて" : category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>並び替え</h3>
                <div className={styles.sortButtons}>
                  <button
                    className={`${styles.sortButton} ${sortBy === "newest" ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy("newest")}
                  >
                    新着順
                  </button>
                  <button
                    className={`${styles.sortButton} ${sortBy === "popular" ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy("popular")}
                  >
                    人気順
                  </button>
                  <button
                    className={`${styles.sortButton} ${sortBy === "alphabetical" ? styles.sortButtonActive : ''}`}
                    onClick={() => setSortBy("alphabetical")}
                  >
                    名前順
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 検索結果 */}
        <div className={styles.searchGroupResult}>
          <div className={styles.searchResultHeader}>
            <h3 className={styles.searchGroupLabel}>
              検索結果 <span className={styles.resultCount}>{searchGroupResult.length}件</span>
            </h3>
          </div>
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>グループを検索中...</p>
            </div>
          ) : (
            <div className={styles.searchGroupList}>
              {searchGroupResult.length > 0 ? (
                searchGroupResult.map((group) => (
                  <div className={styles.groupCard} key={group.id}>
                    <div className={styles.groupCardHeader}>
                      <div className={styles.groupAvatarContainer}>
                        <div className={styles.groupIcon}>
                          <BsFolder />
                        </div>
                      </div>
                      <div className={styles.groupInfo}>
                        <h3 className={styles.groupName}>{group.name}</h3>
                        <div className={styles.groupMeta}>
                          <span className={styles.groupCategory}>
                            <BsTag /> {group.category}
                          </span>
                          <span className={styles.groupMembers}>
                            <BsPeople /> {group.memberCount}人
                          </span>
                          <span className={styles.groupDate}>
                            <BsCalendar /> {group.createdAt}
                          </span>
                        </div>
                      </div>
                      <button 
                        className={styles.favoriteButton}
                        onClick={() => toggleFavorite(group.id)}
                        aria-label={favoriteGroups.includes(group.id) ? "お気に入りから削除" : "お気に入りに追加"}
                      >
                        {favoriteGroups.includes(group.id) ? <BsStarFill className={styles.starFilled} /> : <BsStar />}
                      </button>
                    </div>
                    
                    <div className={styles.groupDescription}>
                      <p>{group.description}</p>
                    </div>
                    
                    {group.tags && group.tags.length > 0 && (
                      <div className={styles.groupTags}>
                        {group.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className={styles.groupCardFooter}>
                      <button
                        className={styles.requestBtn}
                        onClick={(e) => {
                          handleRequestGroup(e, group.id, group.created_by);
                        }}
                      >
                        参加リクエスト
                      </button>
                      <button className={styles.detailsBtn}>
                        詳細を見る
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <BsFolder />
                  </div>
                  <h3>グループが見つかりません</h3>
                  <p>検索条件を変更するか、新しいグループを作成してみましょう</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  );
}
