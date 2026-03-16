"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTransition } from "react"

import { addProvider, updateProvider } from "@/actions/provider"
import { addProviderSchema } from "@/validations/provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Provider } from "@/db/schema"

interface ProviderFormProps {
  provider?: Provider
  mode: "add" | "edit"
}

export function ProviderForm({ provider, mode }: ProviderFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof addProviderSchema>>({
    resolver: zodResolver(addProviderSchema),
    defaultValues: {
      name: provider?.name ?? "",
      bio: provider?.bio ?? "",
      telegramId: provider?.telegramId ?? "",
      status: provider?.status ?? "active",
    },
  })

  function onSubmit(values: z.infer<typeof addProviderSchema>) {
    startTransition(async () => {
      if (mode === "add") {
        const result = await addProvider(values)
        if (result === "success") {
          router.push("/admin/providers")
        }
      } else if (provider) {
        const result = await updateProvider({
          id: provider.id,
          ...values,
        })
        if (result === "success") {
          router.push("/admin/providers")
        }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Provider name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short bio..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegramId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Telegram ID"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="traveling">Traveling</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : mode === "add"
                ? "Add Provider"
                : "Update Provider"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/providers")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
