import styles from "./requestToast.module.css";
import { MdCheck, MdClose, MdOutlinePause } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import { toast } from "react-toastify";

export function RequestToast({notification, userId}) {
    
    // userIdを整数に変換
    const userIdInt = parseInt(userId);


    // MARK: 通知を承認する
    const handleAccept = async (notificationId, groupId, inviteUserId, typeId) => {
        // 承認
        await fetch(`/api/db?table=acceptRequest&notificationId=${notificationId}`);

        // 参加リクエストの場合
        if (typeId === 1) {
            await fetch(`/api/db?table=inviteGroup&groupId=${groupId}&inviteUserId=${inviteUserId}&userId=${userId}`);
            toast.success('リクエストを承認しました');

        // 招待の場合
        } else if (typeId === 2) {
            await fetch(`/api/db?table=joinGroup&groupId=${groupId}&inviteUserId=${inviteUserId}`);
            toast.success('グループに参加しました');
        }
    }

    // MARK: 通知を拒否する
    const handleReject = async (notificationId) => {
        // 拒否
        await fetch(`/api/db?table=rejectRequest&notificationId=${notificationId}`);
        toast.success('拒否しました');
    };

    // MARK: 通知の内容を表示する
    const messageContent = (notification) => {
        // MARK: 自分が通知を送信した場合
        if (notification.sender_id === userIdInt) {
            // MARK: 参加リクエスト
            if (notification.type_id === 1) {
                return (
                    <>
                        <span className={styles.noticeGroupName}>
                            {notification.name}
                        </span>への<br />
                        <span className={styles.noticeGroupName}>
                            参加リクエスト
                        </span>
                    </>
                )
            }
            // MARK: 招待
            else if (notification.type_id === 2) {
                return (
                    <>
                        <span className={styles.noticeGroupName}>
                            {notification.name}
                        </span>への<br />
                        <span className={styles.noticeGroupName}>
                            招待
                        </span>
                    </>
                )
            }

        // MARK:自分が通知を受け取った場合
        } else if (notification.sender_id !== userIdInt) {
            // MARK: 参加リクエスト
            if (notification.type_id === 1) {
                return (
                    <>
                        <span className={styles.noticeUserName}>
                            {notification.username}さん
                        </span>から
                        <span className={styles.noticeGroupName}>
                            「{notification.name}」
                        </span>への
                        <span className={styles.noticeTypeRequest}>
                            参加リクエスト
                        </span>があります
                    </>
                )
            }
            // MARK: 招待
            else if (notification.type_id === 2) {
                return (
                    <>
                        <span className={styles.noticeUserName}>
                            {notification.username}さん
                        </span>から
                        <span className={styles.noticeGroupName}>
                            「{notification.name}」
                        </span>への
                        <span className={styles.noticeTypeInvite}>
                            招待
                        </span>があります
                    </>
                )
            }
        }
    }

    return (
        <>
        {/* 自分が通知を送信した場合 */}
        {notification.sender_id === userIdInt && (
            <>
            {/* 参加リクエスト */}
            {notification.type_id === 1 && (
                <div className={styles.toast}>
                    <div className={styles.status}>
                        <GrStatusGoodSmall color="#f74" />
                    </div>
                    <p className={styles.messageContent}>
                        {messageContent(notification)}
                    </p>
                    <p className={styles.subMessage}>
                        <MdOutlinePause />相手の承認を待っています
                    </p>
                </div>
            )}
            {/* 招待 */}
            {notification.type_id === 2 && (
                <div className={styles.toast}>
                    <div className={styles.status}>
                        <GrStatusGoodSmall color="#f74" />
                    </div>
                    <p className={styles.messageContent}>
                        {messageContent(notification)}
                    </p>
                    <p className={styles.subMessage}>
                        <MdOutlinePause />相手の承認を待っています
                    </p>
                </div>
            )}
            </>
        )}

        {/* 自分が通知を受け取った場合 */}
        {notification.user_id === userIdInt && (
            <>
            {/* 参加リクエスト */}
            {notification.type_id === 1 && (
                <div className={styles.toast}>
                    <div className={styles.status}>
                        <GrStatusGoodSmall color="#4f4" />
                    </div>
                    <p className={styles.messageContent}>
                        {messageContent(notification)}
                    </p>
                    <button 
                        className={styles.acceptBtn} 
                        onClick={() => {handleAccept(
                            notification.id, notification.group_id, 
                            notification.sender_id, notification.type_id
                        );}}
                    >
                        <MdCheck size={20}/>
                    </button>
                    <button 
                        className={styles.rejectBtn} 
                        onClick={() => {handleReject(notification.id); }}
                    >
                        <MdClose size={20}/>
                    </button>
                </div>
            )}
            {/* 招待 */}
            {notification.type_id === 2 && (
                <div className={styles.toast}>
                    <div className={styles.status}>
                        <GrStatusGoodSmall color="#4f4" />
                    </div>
                    <p className={styles.messageContent}>
                        {messageContent(notification)}
                    </p>
                    <button 
                        className={styles.acceptBtn} 
                        onClick={() => {handleAccept(
                            notification.id, notification.group_id, 
                            notification.user_id, notification.type_id
                        );}}
                    >
                        <MdCheck size={20}/>
                    </button>
                    <button 
                        className={styles.rejectBtn} 
                        onClick={() => {handleReject(notification.id);}}
                    >
                        <MdClose size={20}/>
                    </button>
                </div>
            )}
            </>
        )}
        </>
    )
}