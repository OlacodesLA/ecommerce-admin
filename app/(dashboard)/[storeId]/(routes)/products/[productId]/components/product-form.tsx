"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import {
  deleteBillboard,
  patchImage,
  postImage,
} from "@/axios/endpoints/storage.endpoint";
import { current } from "@reduxjs/toolkit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteProduct,
  patchProduct,
  postProduct,
} from "@/axios/endpoints/product.endpoint";
import { Textarea } from "@/components/ui/textarea";
import { FancyMultiSelect } from "@/components/ui/fancyMultiSelect";

const itemSchema = z.object({
  quantity: z.number().int(),
  size: z.string(),
  color: z.string(),
  sizeValue: z.string(),
  colorValue: z.string(),
});
const CategorySchema = z.object({
  value: z.string(),
  name: z.string(),
});

const formSchema = z.object({
  name: z.string().min(1),
  images: z.array(z.string()),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.array(z.string()),
  category: z.array(CategorySchema),
  colorId: z.array(z.string()),
  isFeatured: z.boolean().default(false).optional(),
  isNew: z.boolean().default(false).optional(),
  isSeason: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(160, {
      message: "Description must not be longer than 30 characters.",
    }),

  items: z.array(itemSchema),
});

interface ProductFormProps {
  initialData: any;
  categories: any;
  colors: any;
  sizes: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
}: any) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const origin = useOrigin();

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          items: initialData?.items || [],
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          category: [],
          description: "",
          sizeId: [],
          colorId: [],
          items: [],
          isFeatured: false,
          isNew: false,
          isSeason: false,
          isArchived: false,
        },
  });

  console.log(form.getValues());

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (initialData) {
        await patchProduct(params.storeId, data, params.productId);
      } else {
        await postProduct(params.storeId, data);
      }
      router.refresh();
      console.log(data);
      // router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(params.storeId, params.productId);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const addItem = () => {
    const newItems = [
      ...form.getValues("items"),
      { quantity: 0, size: "", color: "", sizeValue: "", colorValue: "" },
    ];
    form.setValue("items", newItems, { shouldDirty: true });
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    currentItems.splice(index, 1);
    form.setValue("items", currentItems, { shouldDirty: true });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            disabled={loading}
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={(field.value || [])
                      .flat()
                      .map((image: any) => image)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, url].flat())
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value
                          .flat()
                          .filter((current: any) => current !== url)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category" // Change the name to accept an array of strings
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FancyMultiSelect // Use FancyMultiSelect instead of Select
                    selected={field.value} // Pass the selected value as an array
                    onChange={field.onChange} // Handle the onChange event
                    options={categories.map((category: any) => ({
                      value: category.id,
                      name: category.name,
                    }))} // Map categories to required format for FancyMultiSelect
                    placeholder="Select categories" // Provide a placeholder
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="999.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the product"
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Details about the product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row h-24 items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex flex-row h-24 items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="">
                    <FormLabel>New Collection</FormLabel>
                    <FormDescription>
                      This product will appear as new collection.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSeason"
              render={({ field }) => (
                <FormItem className="flex flex-row h-24 items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="">
                    <FormLabel>Seasonal Trends </FormLabel>
                    <FormDescription>
                      This product will appear as seasonal collection.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row h-24 items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="">
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items</FormLabel>
                  <div className="flex flex-col gap-4 ">
                    {field.value.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-full">
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) => {
                              console.log("Updating quantity:", e.target.value);
                              const newItems = [...field.value];
                              newItems[index].quantity = parseInt(
                                e.target.value,
                                10
                              );
                              form.setValue("items", newItems);
                            }}
                          />
                        </div>
                        <div className="w-full">
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              console.log("Updating size:", value);
                              const newItems = [...field.value];
                              newItems[index].size = value;
                              const selectedValues = () => {
                                const size = sizes.find(
                                  (s: { name: string }) => s.name === value
                                );

                                return size ? size.value : null;
                              };
                              console.log(selectedValues());
                              newItems[index].sizeValue = selectedValues();
                              form.setValue("items", newItems);
                              //SizeId
                              // Accumulate selected size ids into an array
                              const selectedSizeIds = newItems.map((item) => {
                                const size = sizes.find(
                                  (s: { name: string }) => s.name === item.size
                                );
                                return size ? size.id : null;
                              });

                              console.log("selectedSizeIds", selectedSizeIds);
                              form.setValue(
                                "sizeId",
                                selectedSizeIds.filter(Boolean)
                              );
                            }}
                            value={item.size}
                            defaultValue={item.size}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={item.size}
                                  placeholder="Select a size"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sizes.map((size: any) => (
                                <SelectItem key={size.id} value={size.name}>
                                  {size.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full">
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              console.log("Updating color:", value);
                              const newItems = [...field.value];
                              newItems[index].color = value;
                              const selectedValues = () => {
                                const color = colors.find(
                                  (c: { name: string }) => c.name === value
                                );

                                return color ? color.value : null;
                              };
                              console.log(selectedValues());
                              newItems[index].colorValue = selectedValues();

                              form.setValue("items", newItems);

                              // Accumulate selected color ids into an array
                              const selectedColorIds = newItems.map((item) => {
                                const color = colors.find(
                                  (c: { name: string }) => c.name === item.color
                                );
                                return color ? color.id : null;
                              });
                              console.log("selectedColorIds", selectedColorIds);
                              form.setValue(
                                "colorId",
                                selectedColorIds.filter(Boolean)
                              );
                            }}
                            value={item.color}
                            defaultValue={item.color}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={item.color}
                                  placeholder="Select a color"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colors.map((color: any) => (
                                <SelectItem key={color.id} value={color.name}>
                                  {color.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => removeItem(index)}
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={addItem}
                      variant="secondary"
                      type="button"
                      className="mt-5 bg-gray-200 text-black"
                    >
                      Add New Item
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
