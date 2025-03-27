
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import { fetchProducts } from "@/utils/productUtils";
import PageLayout from "@/components/layout/PageLayout";

const ProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button asChild>
            <Link to="/admin/products/add">
              <Plus size={16} className="mr-2" /> Add New Product
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive">Error loading products. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.category}</CardDescription>
                      </div>
                      <Badge>${product.price.toFixed(2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < product.rating ? "fill-gold text-gold" : "text-muted"}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.isOrganic && <Badge variant="outline" className="text-xs">Organic</Badge>}
                      {product.isNew && <Badge variant="outline" className="text-xs">New</Badge>}
                      {product.origin && <Badge variant="outline" className="text-xs">{product.origin}</Badge>}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => paginate(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProductManagement;
