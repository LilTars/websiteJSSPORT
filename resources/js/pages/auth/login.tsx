import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import type { TeamInvitationContext } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword: _canResetPassword,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            {teamInvitation && (
                <TeamInvitationAlert
                    invitation={teamInvitation}
                    action="Log in"
                />
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="mx-auto w-full max-w-xl"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm md:p-8">
                        <Link
                            href={home()}
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                            aria-label="ย้อนกลับไปหน้าหลัก"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            ย้อนกลับ
                        </Link>

                        <div className="flex justify-center">
                            <img
                                src="/images/logos/logojs.png"
                                alt="JS SPORT Group"
                                className="h-28 w-auto object-contain md:h-36"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">ชื่อบัญชี หรืออีเมล</Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="username"
                                placeholder="กรอกชื่อบัญชีหรืออีเมล"
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">รหัสผ่าน</Label>
                                
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="กรอกรหัสผ่าน"
                                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                            />
                            <InputError message={errors.password} />
                        </div>

                        
                        <Button
                            type="submit"
                            className="mt-2 w-full bg-slate-900 text-white hover:bg-slate-800"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            เข้าสู่ระบบ
                        </Button>

                        
                    </div>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: '',
    description: '',
};
