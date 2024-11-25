import { Image, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, FlatList, Modal, TextInput } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define os tipos para os dados
interface FoodItem {
  id: string;
  name: string;
  time: string;
  price: string;
  rating: number;
  restaurantId: number;
  image: string; // URL da imagem
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
}

export default function HomeScreen() {
  // const [fontsLoaded] = useFonts({
  //   'Esteban-Regular': require('../../assets/fonts/Esteban-Regular.ttf'),
  // });

  const [recomendados, setRecomendados] = useState<FoodItem[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurant[]>([]);
  const [restauranteSolo, setRestauranteSolo] = useState<Restaurant | null>(null);
  const [modalRestaurante, setModalRestaurante] = useState(false);
  const [nome, setNome] = useState('')
  const [comidas, setComidas] = useState<any>([])
  const [comidaSolo, setComidaSolo] = useState<any>()
  const [modalComida, setModalComida] = useState(false)
  const [restaurante, setRestaurante] = useState<any>()
  const [modalCompra, setModalCompra] = useState<any>(false)

  const listarRecomendados = () => {
    axios
      .get('https://apifakedelivery.vercel.app/foods')
      .then((response) => {
        setRecomendados(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const listarRestaurantes = () => {
    axios
      .get('https://apifakedelivery.vercel.app/restaurants')
      .then((response) => {
        setRestaurantes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const abrirRestaurante = (id: number) => {
    axios
      .get(`https://apifakedelivery.vercel.app/restaurants/${id}`)
      .then((response) => {
        setRestauranteSolo(response.data);
        setModalRestaurante(true)
        setComidas([]);
        console.log(response.data.id)
        pegarComidas(response.data.id)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const abrirComida = (id: any) => {
    axios.get(`https://apifakedelivery.vercel.app/foods/${id}`)
      .then(response => {
        setComidaSolo(response.data)
        setModalComida(true)
        pegarRestaurante(response.data.restaurantId)
        console.log(response.data.restaurantId)
      }).catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    listarRecomendados();
    listarRestaurantes();
  }, []);

  const pegarRestaurante = (id: any) => {
    const restaurantePertence = restaurantes.filter(item => item.id == id)
    console.log(restaurantePertence, 'aaaaa')
    setRestaurante(restaurantePertence)
  }

  const pegarComidas = (id: any) => {
    const novasComidas = recomendados.filter(item => item.restaurantId === id);
    setComidas((prev: any) => {
      const idsExistentes = prev.map((item: { id: any; }) => item.id);
      const comidasUnicas = novasComidas.filter(item => !idsExistentes.includes(item.id));
      return [...prev, ...comidasUnicas];
    });
  }

  const renderItemRecomendado = ({ item }: { item: FoodItem }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => abrirComida(item.id)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.time}</Text>
        <Text style={styles.price}>R$ {item.price}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </TouchableOpacity>
    </View>
  );


  const renderItemRestaurante = ({ item }: { item: Restaurant }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => abrirRestaurante(item.id)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComidas = ({ item }: { item: any }) => {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        <TouchableOpacity onPress={() => abrirComida(item.id)} style={{ alignItems: 'center' }}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>{item.time}</Text>
          <Text style={styles.price}>R$ {item.price}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={{ width: '60%', textAlign: 'center' }}>{item.description}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={{ fontSize: 32 }}>Delivery App</Text>
      </View>
      <View style={styles.banner}>
        <Text style={{ color: 'white', fontSize: 22, width: '68%', fontFamily: 'Esteban-Regular', marginLeft: 20 }}>
          Cupom 20% de desconto em açai
        </Text>
        <Image source={require('../../assets/images/acai.png')} style={{ width: '28%', height: '100%', zIndex: 2 }} />
        <View style={styles.imagemdoitem}></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendados</Text>
        <FlatList
          data={recomendados}
          renderItem={renderItemRecomendado}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listHorizontal}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estabelecimentos</Text>
        <FlatList
          data={restaurantes}
          renderItem={renderItemRestaurante}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listHorizontal}
        />
      </View>
      {restauranteSolo && (
        <Modal visible={modalRestaurante} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{restauranteSolo.name}</Text>
            <Image source={{ uri: restauranteSolo.image }} style={styles.modalImage} />
            <Text style={styles.modalDescription}>{restauranteSolo.description}</Text>
            <Text style={{ fontWeight: 'bold', marginTop: '5%', marginBottom: '5%', fontSize: 20 }}>Produtos</Text>
            <FlatList
              data={comidas}
              renderItem={renderComidas}
              keyExtractor={(item, index) => item.id || index.toString()}
              style={{ width: '100%' }}
            />
            <TouchableOpacity onPress={() => setModalRestaurante(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {comidaSolo && (
        <Modal visible={modalComida} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{comidaSolo.name}</Text>
            <Image source={{ uri: comidaSolo.image }} style={styles.modalImage} />
            <Text style={{ textAlign: 'center', fontWeight: '300', fontSize: 20, borderColor: 'black', borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, width: '100%', paddingBottom: 10, paddingTop: 10 }}>Preço: R$ {comidaSolo.price}     Avaliação: ⭐{comidaSolo.rating}     Delivery: {comidaSolo.delivery}     Tempo: {comidaSolo.time}</Text>
            <Text style={{ textAlign: 'left', fontWeight: '400', fontSize: 20 }}>{comidaSolo.description}</Text>
            <Text style={{ fontWeight: 'bold', marginTop: '5%', marginBottom: '5%', fontSize: 20 }}>Restaurante</Text>
            <Image source={{ uri: restaurante[0].image }} style={styles.ImagemRest} />
            <TouchableOpacity onPress={() => setModalComida(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  header: {
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center'
  },
  barradepesquisa: {
    flexDirection: 'row',
    marginTop: '5%',
    width: '90%',
    height: 45,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10
  },
  banner: {
    marginTop: '10%',
    width: '90%',
    height: 125,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%'
  },
  imagemdoitem: {
    width: '25%',
    height: '100%',
    backgroundColor: '#FFC702',
    position: 'absolute',
    right: 0,
    borderRadius: 20
  },
  section: {
    marginTop: '4%',
    width: '90%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  listHorizontal: {
    flexDirection: 'row'
  },
  list: {
    justifyContent: 'center'
  },
  card: {
    flex: 1,
    margin: 8,
    marginBottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 2
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  rating: {
    fontSize: 14,
    color: 'white',
    position: 'absolute',
    backgroundColor: 'black',
    padding: 2,
    borderRadius: 3
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: 'black'
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
  },
  ImagemRest: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black'
  }
});