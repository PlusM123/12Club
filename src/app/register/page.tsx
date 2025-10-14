import { Card, CardBody, CardHeader } from '@heroui/react'
import Image from 'next/image'
import { Config } from '@/config/config'
import { RegisterForm } from '@/components/loginRegister/Register'

export default function Page() {
  return (
    <div className="flex items-center justify-center mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pt-8 space-y-6">
          <div className="flex items-center space-x-2 font-medium cursor-default text-medium text-default-500">
            <Image
              src="/favicon.ico"
              priority={true}
              alt={Config.titleShort}
              width={36}
              height={36}
            />
            <span>{Config.titleShort}</span>
          </div>

          <h1 className="text-3xl font-bold">注册</h1>
        </CardHeader>
        <CardBody className="flex justify-center px-8 py-6">
          <RegisterForm />
        </CardBody>
      </Card>
    </div>
  )
}
