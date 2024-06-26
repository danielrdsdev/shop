import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Product } from "@/types";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { ProductDetails } from "./_components/product-details";

type ProductPageProps = {
	params: {
		id: string;
	};
};

const getProduct = async (id: string): Promise<Product | undefined> => {
	try {
		const res = await fetch(`${process.env.API_URL}/${id}`, {
			next: {
				revalidate: 60,
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error! stats: ${res.status}`);
		}

		return res.json();
	} catch (error) {
		console.log(error);
	}
};

export const generateStaticParams = async () => {
	const products = await fetch(process.env.API_URL as string).then((res) =>
		res.json(),
	);

	return products.map((item: Product) => ({
		id: item.id,
	}));
};

export default async function ProductPage({
	params: { id },
}: ProductPageProps) {
	const product = await getProduct(id);

	if (!product) {
		return notFound();
	}

	return (
		<div className="space-y-8">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<ProductDetails product={product} />
		</div>
	);
}
