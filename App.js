import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PRODUCTS_DATA } from './src/data';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar productos según el texto ingresado en el buscador
  const filteredProducts = PRODUCTS_DATA.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }) => {
    // Determinar el precio mínimo de este producto entre los comercios
    const minPrice = Math.min(...item.stores.map((s) => s.price));

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>

        <Text style={styles.sectionSubtitle}>Precios por comercio:</Text>

        {item.stores.map((store) => {
          const isCheapest = store.price === minPrice;
          return (
            <View
              key={store.id}
              style={[styles.storeRow, isCheapest && styles.bestPriceRow]}
            >
              <Text style={styles.storeName}>{store.name}</Text>
              <View style={styles.priceContainer}>
                {isCheapest && <Text style={styles.badge}>¡Mejor Precio!</Text>}
                <Text style={[styles.priceText, isCheapest && styles.bestPriceText]}>
                  ${store.price}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.title}>Smart Shopper 🛒</Text>
        <Text style={styles.subtitle}>Comparador de Precios Barriales</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar producto (ej. Yerba, Leche)..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron productos.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  productCategory: {
    fontSize: 12,
    color: '#3498db',
    backgroundColor: '#ebf5fb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#95a5a6',
    marginBottom: 8,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  bestPriceRow: {
    backgroundColor: '#e8f8f5',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  storeName: {
    fontSize: 15,
    color: '#2c3e50',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#27ae60',
    backgroundColor: '#d4efdf',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  bestPriceText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 17,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 30,
    fontSize: 16,
  },
});