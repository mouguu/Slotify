"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTransition } from "react"

import { addLocation } from "@/actions/location"
import { addLocationSchema } from "@/validations/location"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function LocationForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof addLocationSchema>>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: {
      cityName: "",
      region: "",
    },
  })

  function onSubmit(values: z.infer<typeof addLocationSchema>) {
    startTransition(async () => {
      const result = await addLocation(values)
      if (result === "success") {
        form.reset()
        router.refresh()
        onSuccess?.()
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-3"
      >
        <FormField
          control={form.control}
          name="cityName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input placeholder="City name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input
                  placeholder="Region"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Location"}
        </Button>
      </form>
    </Form>
  )
}
