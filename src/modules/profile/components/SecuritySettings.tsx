import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { currentUserKey } from '@/modules/auth/hooks/use-current-user';
import type { CurrentUser } from '@/modules/auth/types/auth.types';
import { profileApi } from '@/modules/profile/api/profile.api';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';

interface SecuritySettingsProps {
  user: CurrentUser;
}

/** Lets the user turn the emailed login code (second login step) on or off. */
export const SecuritySettings = ({ user: _user }: SecuritySettingsProps) => { // user renamed to _user (unused)
  const queryClient = useQueryClient();

  // TODO: loginOtpEnabled not in BE model - feature disabled (variable removed)

  // Optimistic update: the switch flips immediately and flips back if the request fails.
  const toggleLoginOtp = useMutation({
    mutationFn: (_loginOtpEnabled: boolean) => profileApi.updateSecurity({ loginOtpEnabled: false }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: currentUserKey });
      const previous = queryClient.getQueryData<CurrentUser>(currentUserKey);
      if (previous) queryClient.setQueryData(currentUserKey, previous); // No update since field doesn't exist
      return { previous };
    },
    onError: (error, _loginOtpEnabled, context) => {
      if (context?.previous) queryClient.setQueryData(currentUserKey, context.previous);
      toast.error(getApiErrorMessage(error, 'Could not update the setting.'));
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(currentUserKey, updated);
      toast.success('Feature not implemented in backend');
    },
  });

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor="login-otp">Email code at login (Not Implemented)</Label>
        <p className="text-sm text-muted-foreground">
          This feature requires loginOtpEnabled field in BE User model.
        </p>
      </div>
      <Switch
        id="login-otp"
        checked={false}
        disabled={true}
        onCheckedChange={(checked) => toggleLoginOtp.mutate(checked)}
      />
    </div>
  );
};
