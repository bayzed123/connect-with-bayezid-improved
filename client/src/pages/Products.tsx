import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Filter } from "lucide-react";
import { Link } from "wouter";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all active products
  const { data: products = [], isLoading } = trpc.products.getActive.useQuery();

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="w-full px-4 py-16 md:py-24 bg-gradient-to-b from-indigo-600/20 to-transparent border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services & Products
          </h1>
          <p className="text-lg text-indigo-300 max-w-2xl">
            Explore our comprehensive range of services and products designed to help your business grow
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="w-full px-4 py-8 border-b border-indigo-500/20">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No products found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <Card className="h-full bg-white/10 border-white/20 hover:border-indigo-500/50 transition-all hover:bg-white/15 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1">
                      {/* Product Image */}
                      {product.image && (
                        <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg line-clamp-2">
                              {product.name}
                            </CardTitle>
                            {product.category && (
                              <Badge variant="secondary" className="mt-2">
                                {product.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {product.description && (
                          <CardDescription className="text-slate-300 line-clamp-2 mb-4">
                            {product.description}
                          </CardDescription>
                        )}

                        {/* Pricing */}
                        <div className="flex items-center gap-2 mb-4">
                          {product.discountPrice ? (
                            <>
                              <span className="text-2xl font-bold text-indigo-400">
                                ${parseFloat(product.discountPrice).toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-400 line-through">
                                ${parseFloat(product.price || "0").toFixed(2)}
                              </span>
                            </>
                          ) : product.price ? (
                            <span className="text-2xl font-bold text-indigo-400">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Contact for pricing</span>
                          )}
                        </div>

                        {/* View Button */}
                        <Link href={`/checkout/${product.id}`}>
                          <a>
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Buy Now
                            </Button>
                          </a>
                        </Link>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-4 py-16 bg-gradient-to-t from-indigo-600/10 to-transparent border-t border-indigo-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-slate-300 mb-8">
            Contact us for custom services or to discuss your specific needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <a>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50">
                  Contact Us
                </Button>
              </a>
            </Link>
            <a href="https://wa.me/message/TDYG575YENF6F1" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
