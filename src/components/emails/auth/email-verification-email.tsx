import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { siteConfig } from "@/config/site"

interface EmailVerificationEmailProps {
  email: string
  emailVerificationToken: string
}

export function EmailVerificationEmail({
  email,
  emailVerificationToken,
}: Readonly<EmailVerificationEmailProps>): JSX.Element {
  const previewText = `Verify your email on ${siteConfig.nameShort}`
  return (
    <Html lang="en">
      <Head>
        <title>{previewText}</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Text className="text-xl">Hello,</Text>
              <Text className="text-base">
                Someone just used the email {email} to create an account on{" "}
                <span className="font-semibold tracking-wide">
                  {siteConfig.nameShort}
                </span>
                .
              </Text>
              <Text className="text-base">
                If this was you, click the link below to verify your email
                address and complete the registration.
              </Text>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL}/register/verify-email?token=${emailVerificationToken}`}
              >
                Verify email address
              </Button>
            </Section>

            <Section>
              <Text className="text-xs">
                If you did not try to register, please ignore this email.
              </Text>
              <Text className="text-base font-medium">Have a great day!</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
