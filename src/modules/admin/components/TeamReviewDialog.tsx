import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

interface TeamReviewDialogProps {
  teamName: string;
  action: 'approve' | 'reject' | null;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export const TeamReviewDialog = ({
  teamName,
  action,
  onConfirm,
  onCancel,
  isPending = false,
}: TeamReviewDialogProps) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (action === 'reject') {
      if (!reason.trim()) {
        return; // Don't submit if reason is empty
      }
      onConfirm(reason);
    } else {
      onConfirm();
    }
  };

  if (!action) return null;

  const isApprove = action === 'approve';

  return (
    <AlertDialog open={!!action} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <>
                <CheckCircle className="size-5 text-green-600" />
                Duyệt đội {teamName}
              </>
            ) : (
              <>
                <XCircle className="size-5 text-destructive" />
                Từ chối đội {teamName}
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isApprove ? (
              <>
                Bạn có chắc muốn <strong className="text-green-600">duyệt</strong> hồ sơ của đội{' '}
                <strong>{teamName}</strong> không?
                <br />
                <br />
                Sau khi duyệt:
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>Quản lý đội sẽ nhận email thông báo</li>
                  <li>Đội có thể tham gia giải đấu</li>
                  <li>Tên và tag đội sẽ bị khóa</li>
                </ul>
              </>
            ) : (
              <>
                Bạn đang <strong className="text-destructive">từ chối</strong> hồ sơ của đội{' '}
                <strong>{teamName}</strong>.
                <br />
                <br />
                Vui lòng nhập lý do từ chối (bắt buộc):
                <Textarea
                  placeholder="VD: Thiếu thông tin liên hệ, tên đội không phù hợp, roster chưa đủ..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-3"
                  rows={4}
                  maxLength={500}
                />
                {reason.trim() && (
                  <p className="mt-2 text-right text-xs text-muted-foreground">
                    {reason.length}/500 ký tự
                  </p>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={onCancel}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={isApprove ? 'default' : 'destructive'}
              disabled={isPending || (action === 'reject' && !reason.trim())}
              onClick={handleConfirm}
            >
              {isPending
                ? 'Đang xử lý...'
                : isApprove
                  ? 'Xác nhận duyệt'
                  : 'Xác nhận từ chối'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
