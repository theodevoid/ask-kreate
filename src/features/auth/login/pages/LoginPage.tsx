import Image from "next/image";
import GoogleLogoIcon from "~/components/icons/GoogleLogoIcon.png";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { supabase } from "~/lib/supabase/client";

const LoginPage = () => {
  const handleLoginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <PageContainer className="flex bg-secondary/20">
      <SectionContainer className="min-h-[calc(100vh-144px)] w-full flex-col items-center justify-center">
        <Card className="w-full max-w-xl border-0 md:border">
          <CardHeader />
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 px-4">
              <div className="w-full max-w-lg space-y-8">
                <div className="flex flex-col gap-1 text-left md:text-center">
                  <h1 className="text-lg font-semibold lg:text-2xl">
                    Ask Kreate
                  </h1>
                  <h3 className="text-2xl font-bold lg:text-4xl">
                    P, Login! 👋
                  </h3>
                </div>

                <div className="">
                  <Button
                    onClick={handleLoginWithGoogle}
                    variant="secondary"
                    className="w-full"
                  >
                    <Image
                      className="size-4"
                      unoptimized
                      src={GoogleLogoIcon}
                      alt="Google icon"
                    />
                    Login dengan Google
                  </Button>
                </div>

                {/* <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground">
                      Belum punya akun?{" "}
                      <Link href="/register" className="text-primary font-bold">
                        Buat akun
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground">
                      Belum verifikasi email?{" "}
                      <Link
                        href="/resend-verification"
                        className="text-primary font-bold"
                      >
                        Kirim ulang email verifikasi
                      </Link>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
          <CardFooter />
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};

export default LoginPage;
